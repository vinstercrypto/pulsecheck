import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Production: filter by start_ts within the last N days
  const { data, error } = await supabase
    .from('poll_results')
    .select('*')
    .in('status', ['live', 'closed'])
    .gt('total_votes', 0)
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