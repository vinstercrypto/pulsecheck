import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

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

  // Parse the options JSON string into an array
  const parsedData = data?.map(poll => ({
    ...poll,
    options: typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options
  })) || [];

  return NextResponse.json(parsedData);
}