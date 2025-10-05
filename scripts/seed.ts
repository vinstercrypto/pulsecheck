import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Starting seed...');

  await supabase.from('vote').delete().neq('poll_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('poll').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const now = new Date();
  const polls = [];

  // Poll 1 - LIVE
  const live1Start = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const live1End = new Date(now.getTime() + 22 * 60 * 60 * 1000);
  polls.push({
    question: 'Will AI replace most jobs by 2030?',
    options: JSON.stringify(['Yes', 'No', 'Unsure']),
    start_ts: live1Start.toISOString(),
    end_ts: live1End.toISOString(),
    status: 'live'
  });

  // Poll 2
  const upcoming1Start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const upcoming1End = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  polls.push({
    question: 'Do you trust self-driving cars?',
    options: JSON.stringify(['Yes', 'No', 'Not yet']),
    start_ts: upcoming1Start.toISOString(),
    end_ts: upcoming1End.toISOString(),
    status: 'upcoming'
  });

  // Poll 3
  const upcoming2Start = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const upcoming2End = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  polls.push({
    question: 'Should social media be regulated?',
    options: JSON.stringify(['Yes', 'No', 'Partially']),
    start_ts: upcoming2Start.toISOString(),
    end_ts: upcoming2End.toISOString(),
    status: 'upcoming'
  });

  // Poll 4
  const upcoming3Start = new Date(now.getTime() + 72 * 60 * 60 * 1000);
  const upcoming3End = new Date(now.getTime() + 96 * 60 * 60 * 1000);
  polls.push({
    question: 'Is remote work the future?',
    options: JSON.stringify(['Yes', 'No', 'Hybrid only']),
    start_ts: upcoming3Start.toISOString(),
    end_ts: upcoming3End.toISOString(),
    status: 'upcoming'
  });

  // Poll 5
  const upcoming4Start = new Date(now.getTime() + 96 * 60 * 60 * 1000);
  const upcoming4End = new Date(now.getTime() + 120 * 60 * 60 * 1000);
  polls.push({
    question: 'Will crypto become mainstream?',
    options: JSON.stringify(['Yes', 'No', 'Already is']),
    start_ts: upcoming4Start.toISOString(),
    end_ts: upcoming4End.toISOString(),
    status: 'upcoming'
  });

  const { data: insertedPolls, error } = await supabase
    .from('poll')
    .insert(polls)
    .select();

  if (error) {
    console.error('Error inserting polls:', error);
    throw error;
  }

  console.log(`Successfully seeded ${insertedPolls?.length} polls`);
  console.log('Live poll:', insertedPolls?.[0]?.question);
}

seed()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });