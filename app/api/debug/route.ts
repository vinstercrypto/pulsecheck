import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  if (process.env.TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Debug endpoint disabled' }, { status: 403 });
  }

  try {
    // Check polls table
    const { data: polls, error: pollsError } = await supabase
      .from('poll')
      .select('*')
      .limit(5);

    // Check votes table
    const { data: votes, error: votesError } = await supabase
      .from('vote')
      .select('*')
      .limit(5);

    // Check poll_results view
    const { data: results, error: resultsError } = await supabase
      .from('poll_results')
      .select('*')
      .limit(5);

    return NextResponse.json({
      polls: { data: polls, error: pollsError },
      votes: { data: votes, error: votesError },
      results: { data: results, error: resultsError }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 });
  }
}
