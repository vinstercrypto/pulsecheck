import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const nowIso = new Date().toISOString();

  // DAILY_POLL_COUNT (default 1, allowed 1 or 2)
  const dailyPollCountRaw = process.env.DAILY_POLL_COUNT || '1';
  const dailyPollCount = parseInt(dailyPollCountRaw, 10);
  if (![1, 2].includes(dailyPollCount)) {
    return NextResponse.json({ error: 'Invalid configuration' }, { status: 500 });
  }

  // Live = strictly time-boxed: start_ts <= now < end_ts (no status/day constraints)
  const { data: livePolls, error: liveError } = await supabase
    .from('poll')
    .select('*')
    .lte('start_ts', nowIso)
    .gt('end_ts', nowIso)
    .order('start_ts', { ascending: true })
    .limit(dailyPollCount);

  if (liveError) {
    console.error('Error fetching live polls:', liveError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (livePolls && livePolls.length > 0) {
    const parsed = livePolls.map(p => ({
      ...p,
      options: typeof p.options === 'string' ? JSON.parse(p.options as unknown as string) : p.options,
    }));
    return NextResponse.json({ polls: parsed });
  }

  // If none live, return the next upcoming poll anywhere in the future
  const { data: upcoming, error: upError } = await supabase
    .from('poll')
    .select('*')
    .gt('start_ts', nowIso)
    .order('start_ts', { ascending: true })
    .limit(dailyPollCount);

  if (upError) {
    console.error('Error fetching upcoming polls:', upError);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  if (upcoming && upcoming.length > 0) {
    const startsInSeconds = (new Date(upcoming[0].start_ts).getTime() - new Date(nowIso).getTime()) / 1000;
    return NextResponse.json({ polls: [], starts_in_seconds: startsInSeconds });
  }

  return NextResponse.json({ polls: [] });
}