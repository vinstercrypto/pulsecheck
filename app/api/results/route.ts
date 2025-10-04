import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7', 10);

  if (isNaN(days) || days <= 0) {
    return NextResponse.json({ error: 'Invalid days parameter' }, { status: 400 });
  }

  const now = new Date();
  const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('poll_results')
    .select('*')
    .gte('start_ts', pastDate)
    .lte('start_ts', now.toISOString())
    .order('start_ts', { ascending: false });

  if (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch poll results.' }, { status: 500 });
  }

  // Parse options for each poll
  const parsedData = data?.map(poll => ({
    ...poll,
    options: typeof poll.options === 'string' 
      ? JSON.parse(poll.options) 
      : poll.options
  })) || [];

  return NextResponse.json(parsedData);
}