import { supabase } from '@/lib/db';
import { verifyProof } from '@/lib/worldid';
import { NextResponse } from 'next/server';
import { Poll } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { pollId, optionIdx, proof, signal, action } = body;

  if (!pollId || typeof optionIdx !== 'number' || !proof) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { data: poll, error: pollError } = await supabase
    .from('poll')
    .select('options, end_ts')
    .eq('id', pollId)
    .single<Pick<Poll, 'options' | 'end_ts'>>();

  if (pollError || !poll) {
    return NextResponse.json({ error: 'Poll not found.' }, { status: 404 });
  }

  let options = poll.options;
  if (typeof poll.options === 'string') {
    try {
      options = JSON.parse(poll.options);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid poll options format.' }, { status: 500 });
    }
  }

  if (!Array.isArray(options)) {
    return NextResponse.json({ error: 'Invalid poll data structure.' }, { status: 500 });
  }

  if (optionIdx < 0 || optionIdx >= options.length) {
    return NextResponse.json({ error: 'Invalid option index.' }, { status: 400 });
  }
  
  if (new Date() >= new Date(poll.end_ts)) {
    return NextResponse.json({ error: 'This poll has closed.' }, { status: 403 });
  }

  try {
    const expectedAction = process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE;
    if (!expectedAction) throw new Error("Action ID is not configured.");

    if (action && action !== expectedAction) {
      console.warn('Mismatched action from client', { action, expectedAction });
      return NextResponse.json({ error: 'Invalid verification action.' }, { status: 400 });
    }

    const actionId = expectedAction;

    console.log("Server: Verifying proof...");
    const { isHuman, nullifier_hash, code } = await verifyProof(proof, actionId, signal);

    if (!isHuman) {
      if (code === 'max_verifications_reached') {
        return NextResponse.json(
          { error: 'You have already verified for this poll. Please come back tomorrow.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Verification failed. Please verify in World App and try again.' },
        { status: 403 }
      );
    }

    // For testing only: allow bypassing single-vote constraint by tweaking nullifier
    const allowMultiVotes = process.env.TEST_ALLOW_MULTI_VOTES === 'true';
    const testingNullifier = allowMultiVotes ? `${nullifier_hash}:${Math.random().toString(36).slice(2, 8)}` : nullifier_hash;

    const { error: voteError } = await supabase
      .from('vote')
      .insert({
        poll_id: pollId,
        nullifier_hash: testingNullifier,
        option_idx: optionIdx,
      });

    if (voteError) {
      if (voteError.code === '23505') {
        return NextResponse.json(
          { error: 'You have already voted in this poll.' },
          { status: 409 }
        );
      }
      throw voteError;
    }

    const { data: results, error: resultsError } = await supabase
      .from('poll_results')
      .select('counts, total_votes')
      .eq('poll_id', pollId)
      .single();

    if (resultsError || !results) {
      throw new Error('Could not fetch results after voting.');
    }

    const totalsPerOption = options.map((_: any, index: number) => {
      const found = results.counts.find((c: { option_idx: number }) => c.option_idx === index);
      return found ? found.count : 0;
    });

    return NextResponse.json({
      message: 'Vote successful',
      totalsPerOption,
      totalVotes: results.total_votes,
    });
  } catch (error) {
    console.error('Vote processing error:', error);
    return NextResponse.json(
      { error: 'Vote submission failed. Please try again later.' },
      { status: 500 }
    );
  }
}