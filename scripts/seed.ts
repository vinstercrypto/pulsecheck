import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load .env.local file explicitly
config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Starting seed...');

  // Create 14 polls
  const now = new Date();
  const polls = [];

  // 7 closed polls (past week)
  for (let i = 7; i >= 1; i--) {
    const start = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 20 * 60 * 60 * 1000);
    
    polls.push({
      question: `Sample poll from ${i} days ago?`,
      options: JSON.stringify(['Yes', 'No', 'Maybe']),
      start_ts: start.toISOString(),
      end_ts: end.toISOString(),
      status: 'closed'
    });
  }

  // 1 live poll (today)
  const liveStart = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const liveEnd = new Date(now.getTime() + 22 * 60 * 60 * 1000);
  polls.push({
    question: 'Do you think AI will transform society in the next 5 years?',
    options: JSON.stringify(['Definitely', 'Probably', 'Maybe', 'Unlikely', 'No']),
    start_ts: liveStart.toISOString(),
    end_ts: liveEnd.toISOString(),
    status: 'live'
  });

  // 6 scheduled polls (future days)
  for (let i = 1; i <= 6; i++) {
    const start = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 20 * 60 * 60 * 1000);
    
    polls.push({
      question: `Upcoming poll ${i} - Sample question?`,
      options: JSON.stringify(['Option A', 'Option B', 'Option C']),
      start_ts: start.toISOString(),
      end_ts: end.toISOString(),
      status: 'scheduled'
    });
  }

  const { data, error } = await supabase
    .from('poll')
    .insert(polls)
    .select();

  if (error) {
    console.error('Error seeding polls:', error);
    process.exit(1);
  }

  console.log(`Successfully created ${data?.length} polls`);
  
  // Display the live poll
  const livePoll = data?.find(p => p.status === 'live');
  if (livePoll) {
    console.log('\nLive poll:', livePoll.question);
  }
  
  process.exit(0);
}

seed();