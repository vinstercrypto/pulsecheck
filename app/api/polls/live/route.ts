
import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date().toISOString();

  // Find a poll that is currently live
  const { data: livePoll, error: liveError } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'live')
    .lte('start_ts', now)
    .gte('end_ts', now)
    .limit(1)
    .single();

  if (liveError && liveError.code !== 'PGRST116') { // PGRST116 is "No rows found"
    console.error('Error fetching live poll:', liveError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (livePoll) {
  // Parse options from JSON string to array
  const parsedPoll = {
    ...livePoll,
    options: typeof livePoll.options === 'string' 
      ? JSON.parse(livePoll.options) 
      : livePoll.options
  };
  return NextResponse.json({ poll: parsedPoll });
}

  // If no live poll, find the next scheduled poll
  const { data: scheduledPoll, error: scheduledError } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'scheduled')
    .gt('start_ts', now)
    .order('start_ts', { ascending: true })
    .limit(1)
    .single();

  if (scheduledError && scheduledError.code !== 'PGRST116') {
    console.error('Error fetching scheduled poll:', scheduledError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (scheduledPoll) {
  const startsInSeconds = (new Date(scheduledPoll.start_ts).getTime() - new Date().getTime()) / 1000;
  return NextResponse.json({ poll: null, starts_in_seconds: startsInSeconds });
}
  
  // No live or scheduled polls found
  return NextResponse.json({ poll: null });
}
