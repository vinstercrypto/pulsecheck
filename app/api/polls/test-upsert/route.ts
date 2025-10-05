import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (process.env.TEST_MODE !== 'true') {
    return NextResponse.json({ error: 'Testing endpoint disabled' }, { status: 403 });
  }

  try {
    const { question, options } = await request.json();
    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const now = new Date();
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Close any existing live poll
    await supabase
      .from('poll')
      .update({ status: 'closed' })
      .eq('status', 'live');

    // Insert new live poll
    const { data, error } = await supabase
      .from('poll')
      .insert({
        question,
        options: JSON.stringify(options),
        start_ts: now.toISOString(),
        end_ts: end.toISOString(),
        status: 'live',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ poll: data });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to upsert test poll' }, { status: 500 });
  }
}


