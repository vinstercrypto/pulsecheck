import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('SERVICE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
  
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

  if (liveError && liveError.code !== 'PGRST116') {
  console.error('Error fetching live poll:', liveError);
  console.error('Error code:', liveError.code);
  console.error('Error message:', liveError.message);
  console.error('Error details:', JSON.stringify(liveError, null, 2));
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

  if (livePoll) {
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
  
  return NextResponse.json({ poll: null });
}