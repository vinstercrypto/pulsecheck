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
  const liveStart = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const liveEnd = new Date(now.getTime() + 22 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('poll')
    .insert({
      question: 'Will AI replace most jobs by 2030?',
      options: JSON.stringify(['Yes', 'No', 'Unsure']),
      start_ts: liveStart.toISOString(),
      end_ts: liveEnd.toISOString(),
      status: 'live'
    })
    .select();

  if (error) {
    console.error('Error inserting poll:', error);
    throw error;
  }

  console.log('Successfully seeded poll:', data[0].question);
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