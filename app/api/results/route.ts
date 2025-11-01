import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';
import { advancePolls } from '@/lib/poll-advance';

export async function GET(request: Request) {
  // Update poll statuses before fetching results
  await advancePolls();

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Get recent polls with vote counts, sorted by start_ts desc
  // Include all polls regardless of vote count or status
  const { data, error } = await supabase
    .from('poll_results')
    .select('*')
    .gte('start_ts', cutoffDate.toISOString())
    .order('start_ts', { ascending: false });

  if (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }

  // Parse the options JSON string into an array and map poll_id to id
  const parsedData = data?.map(poll => ({
    ...poll,
    id: poll.poll_id, // Map poll_id to id for frontend compatibility
    options: typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options
  })) || [];

  return NextResponse.json(parsedData);
}