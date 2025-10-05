
import { supabase } from '@/lib/db';
import { verifyProof } from '@/lib/worldid';
import { NextResponse } from 'next/server';
import { Poll } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { pollId, optionIdx, proof, signal } = body;

  // 1. Validate body
  if (!pollId || typeof optionIdx !== 'number' || !proof) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  // Fetch the poll to validate against
  const { data: poll, error: pollError } = await supabase
    .from('poll')
    .select('options, end_ts')
    .eq('id', pollId)
    .single<Pick<Poll, 'options' | 'end_ts'>>();

  if (pollError || !poll) {
    return NextResponse.json({ error: 'Poll not found.' }, { status: 404 });
  }

  // Debug poll structure
  console.log('Poll data:', poll);
  console.log('Poll options type:', typeof poll.options);
  console.log('Poll options:', poll.options);

  // Parse options if it's a string (from JSON.stringify in seed)
  let options = poll.options;
  if (typeof poll.options === 'string') {
    try {
      options = JSON.parse(poll.options);
    } catch (error) {
      console.error('Failed to parse poll options:', error);
      return NextResponse.json({ error: 'Invalid poll options format.' }, { status: 500 });
    }
  }

  // Ensure options is an array
  if (!Array.isArray(options)) {
    console.error('Poll options is not an array:', options);
    return NextResponse.json({ error: 'Invalid poll data structure.' }, { status: 500 });
  }

  if (optionIdx < 0 || optionIdx >= options.length) {
    return NextResponse.json({ error: 'Invalid option index.' }, { status: 400 });
  }
  
  // 3. Reject if poll is closed
  if (new Date() >= new Date(poll.end_ts)) {
    console.log(`Vote rejected for closed poll ${pollId}`);
    return NextResponse.json({ error: 'This poll has closed.' }, { status: 403 });
  }

    try {
    const actionId = process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE ?? 'vote';
    if (!actionId) throw new Error("Action ID is not configured.");

    console.log("Server: Verifying proof...");
    console.log("Action ID:", actionId);
    console.log("Signal:", signal);
    const { isHuman, nullifier_hash, code } = await verifyProof(proof, actionId, signal);

    if (!isHuman) {
      if (code === 'max_verifications_reached') {
        // User-friendly message, no internal payload leak
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
    console.log(`Server: Proof verified. Nullifier: ${nullifier_hash}`);

    const { error: voteError } = await supabase
      .from('vote')
      .insert({
        poll_id: pollId,
        nullifier_hash: nullifier_hash,
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

    const totalsPerOption = options.map((_, index) => {
      const found = results.counts.find((c: { option_idx: number }) => c.option_idx === index);
      return found ? found.count : 0;
    });

    return NextResponse.json({
      message: 'Vote successful',
      totalsPerOption,
      totalVotes: results.total_votes,
    });
  } catch (error) {
    console.error('An error occurred during vote processing:', error);
    return NextResponse.json(
      { error: 'Vote submission failed. Please try again later.' },
      { status: 500 }
    );
  }