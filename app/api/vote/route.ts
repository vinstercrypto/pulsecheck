
import { supabase } from '@/lib/db';
import { verifyProof } from '@/lib/worldid';
import { NextResponse } from 'next/server';
import { Poll } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { pollId, optionIdx, proof } = body;

  // 1. Validate body
  if (!pollId || typeof optionIdx !== 'number' || !proof || typeof proof !== 'object') {
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

  if (optionIdx < 0 || optionIdx >= poll.options.length) {
    return NextResponse.json({ error: 'Invalid option index.' }, { status: 400 });
  }
  
  // 3. Reject if poll is closed
  if (new Date() >= new Date(poll.end_ts)) {
    console.log(`Vote rejected for closed poll ${pollId}`);
    return NextResponse.json({ error: 'This poll has closed.' }, { status: 403 });
  }

  try {
    // 2. Call World ID Verify v2
    const actionId =
      process.env.NEXT_PUBLIC_WORLDCON_ACTION_ID ?? process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE;
    if (!actionId) throw new Error("Action ID is not configured.");

    console.log("Server: Verifying proof...");
    const { isHuman, nullifier_hash } = await verifyProof(proof, actionId);

    if (!isHuman) {
      console.log(`Verification failed for poll ${pollId}: Not a human.`);
      return NextResponse.json({ error: 'Verification failed. You are not a human.' }, { status: 403 });
    }
    console.log(`Server: Proof verified. Nullifier: ${nullifier_hash}`);

    // 4. Upsert vote
    const { error: voteError } = await supabase
      .from('vote')
      .insert({
        poll_id: pollId,
        nullifier_hash: nullifier_hash,
        option_idx: optionIdx,
      });

    if (voteError) {
      if (voteError.code === '23505') { // unique constraint violation
        console.log(`Conflict: Duplicate vote for poll ${pollId} by nullifier ${nullifier_hash}`);
        return NextResponse.json({ error: 'You have already voted in this poll.' }, { status: 409 });
      }
      throw voteError;
    }

    console.log(`Success: Vote cast for poll ${pollId}`);

    // 5. Return updated aggregates
    const { data: results, error: resultsError } = await supabase
      .from('poll_results')
      .select('counts, total_votes')
      .eq('poll_id', pollId)
      .single();

    if (resultsError || !results) {
        throw new Error('Could not fetch results after voting.');
    }

    const totalsPerOption = poll.options.map((_, index) => {
        const found = results.counts.find((c: { option_idx: number }) => c.option_idx === index);
        return found ? found.count : 0;
    });

    return NextResponse.json({ 
        message: 'Vote successful',
        totalsPerOption: totalsPerOption,
        totalVotes: results.total_votes,
    });

  } catch (error) {
    console.error('An error occurred during vote processing:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Vote submission failed: ${message}` }, { status: 500 });
  }
}
