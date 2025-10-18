import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date().toISOString();
  
  // Get DAILY_POLL_COUNT from environment (default: 1, allowed: 1 or 2)
  const dailyPollCountRaw = process.env.DAILY_POLL_COUNT || '1';
  const dailyPollCount = parseInt(dailyPollCountRaw);
  
  if (![1, 2].includes(dailyPollCount)) {
    console.error('DAILY_POLL_COUNT must be 1 or 2, got:', dailyPollCountRaw);
    return NextResponse.json({ error: 'Invalid configuration' }, { status: 500 });
  }

  // Get the start of today in UTC
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

  // Find polls that are live right now (start_ts <= now < end_ts)
  // and started today, limited by DAILY_POLL_COUNT
  const { data: livePolls, error: liveError } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'live')
    .lte('start_ts', now)
    .gte('end_ts', now)
    .gte('start_ts', todayStart.toISOString())
    .lt('start_ts', tomorrowStart.toISOString())
    .order('start_ts', { ascending: true })
    .limit(dailyPollCount);

  if (liveError) {
    console.error('Error fetching live polls:', liveError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (livePolls && livePolls.length > 0) {
    const parsedPolls = livePolls.map(poll => ({
      ...poll,
      options: typeof poll.options === 'string' 
        ? JSON.parse(poll.options) 
        : poll.options
    }));
    return NextResponse.json({ polls: parsedPolls });
  }

  // If no live polls, find the next scheduled poll(s) for today
  const { data: scheduledPolls, error: scheduledError } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'scheduled')
    .gt('start_ts', now)
    .gte('start_ts', todayStart.toISOString())
    .lt('start_ts', tomorrowStart.toISOString())
    .order('start_ts', { ascending: true })
    .limit(dailyPollCount);

  if (scheduledError) {
    console.error('Error fetching scheduled polls:', scheduledError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (scheduledPolls && scheduledPolls.length > 0) {
    const nextPoll = scheduledPolls[0];
    const startsInSeconds = (new Date(nextPoll.start_ts).getTime() - new Date().getTime()) / 1000;
    return NextResponse.json({ polls: [], starts_in_seconds: startsInSeconds });
  }
  
  return NextResponse.json({ polls: [] });
}