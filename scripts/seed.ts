import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read DAILY_POLL_COUNT from env, default to 1, allowed values: 1 or 2
const dailyPollCountRaw = process.env.DAILY_POLL_COUNT || '1';
const DAILY_POLL_COUNT = parseInt(dailyPollCountRaw);

if (![1, 2].includes(DAILY_POLL_COUNT)) {
  throw new Error('DAILY_POLL_COUNT must be 1 or 2');
}

interface PollQuestion {
  question: string;
  options: string[];
}

async function seed() {
  console.log('Starting seed...');
  console.log(`DAILY_POLL_COUNT: ${DAILY_POLL_COUNT}`);

  // Clear existing data
  await supabase.from('vote').delete().neq('poll_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('poll').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Load questions from data/polls.json
  const dataPath = path.join(process.cwd(), 'data', 'polls.json');
  const pollsData: PollQuestion[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  if (pollsData.length < 30 * DAILY_POLL_COUNT) {
    console.warn(`Warning: Need at least ${30 * DAILY_POLL_COUNT} questions for 30 days, found ${pollsData.length}`);
  }

  // Generate 30 days of polls
  const pollsToInsert = [];
  const now = new Date();
  
  // Start from 15 days ago to have historical data
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 15);
  startDate.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() + dayOffset);

    for (let pollIndex = 0; pollIndex < DAILY_POLL_COUNT; pollIndex++) {
      const questionIndex = dayOffset * DAILY_POLL_COUNT + pollIndex;
      if (questionIndex >= pollsData.length) {
        // Wrap around if we run out of questions
        break;
      }

      const pollData = pollsData[questionIndex];
      
      // Non-overlapping time windows
      // If DAILY_POLL_COUNT = 1: 09:00-09:00+1day (24 hours)
      // If DAILY_POLL_COUNT = 2: 
      //   - Poll 0: 09:00-17:00 (8 hours)
      //   - Poll 1: 17:00-01:00 (8 hours)
      
      let startHour: number;
      let durationHours: number;

      if (DAILY_POLL_COUNT === 1) {
        startHour = 9; // 09:00 UTC
        durationHours = 24;
      } else {
        // DAILY_POLL_COUNT === 2
        if (pollIndex === 0) {
          startHour = 9; // 09:00 UTC
          durationHours = 8;
        } else {
          startHour = 17; // 17:00 UTC
          durationHours = 8;
        }
      }

      const start_ts = new Date(currentDay);
      start_ts.setHours(startHour, 0, 0, 0);

      const end_ts = new Date(start_ts);
      end_ts.setHours(end_ts.getHours() + durationHours);

      // Determine status based on current time
      let status: 'scheduled' | 'live' | 'closed';
      if (now < start_ts) {
        status = 'scheduled';
      } else if (now >= start_ts && now < end_ts) {
        status = 'live';
      } else {
        status = 'closed';
      }

      pollsToInsert.push({
        question: pollData.question,
        options: JSON.stringify(pollData.options),
        start_ts: start_ts.toISOString(),
        end_ts: end_ts.toISOString(),
        status: status
      });
    }
  }

  console.log(`Inserting ${pollsToInsert.length} polls...`);

  // Insert in batches of 100
  for (let i = 0; i < pollsToInsert.length; i += 100) {
    const batch = pollsToInsert.slice(i, i + 100);
    const { error } = await supabase.from('poll').insert(batch);
    
    if (error) {
      console.error(`Error inserting batch ${i / 100 + 1}:`, error);
      throw error;
    }
    
    console.log(`Inserted batch ${i / 100 + 1} (${batch.length} polls)`);
  }

  // Count polls by status
  const { data: statusCounts } = await supabase
    .from('poll')
    .select('status');
  
  if (statusCounts) {
    const counts = statusCounts.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nPoll counts by status:');
    console.log(`  Scheduled: ${counts.scheduled || 0}`);
    console.log(`  Live: ${counts.live || 0}`);
    console.log(`  Closed: ${counts.closed || 0}`);
    console.log(`  Total: ${statusCounts.length}`);
  }
}

seed()
  .then(() => {
    console.log('\nSeed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
