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

  // Generate polls starting NOW
  const pollsToInsert = [];
  const nowUtc = new Date();
  // Round up to nearest minute
  nowUtc.setSeconds(0, 0);
  if (nowUtc.getMinutes() !== 0) {
    nowUtc.setMinutes(nowUtc.getMinutes() + 1);
  }

  console.log(`Starting polls from: ${nowUtc.toISOString()}`);

  // TODAY: Create immediate live poll(s)
  for (let pollIndex = 0; pollIndex < DAILY_POLL_COUNT; pollIndex++) {
    const questionIndex = pollIndex;
    if (questionIndex >= pollsData.length) break;

    const pollData = pollsData[questionIndex];
    
    let start_ts: Date;
    let end_ts: Date;
    let status: 'live' | 'scheduled';

    if (DAILY_POLL_COUNT === 1) {
      // Single poll: 24 hours starting now
      start_ts = new Date(nowUtc);
      end_ts = new Date(nowUtc.getTime() + 24 * 60 * 60 * 1000);
      status = 'live';
    } else {
      // Two polls: first starts now (8h), second starts in 8h (8h)
      if (pollIndex === 0) {
        start_ts = new Date(nowUtc);
        end_ts = new Date(nowUtc.getTime() + 8 * 60 * 60 * 1000);
        status = 'live';
      } else {
        start_ts = new Date(nowUtc.getTime() + 8 * 60 * 60 * 1000);
        end_ts = new Date(nowUtc.getTime() + 16 * 60 * 60 * 1000);
        status = 'scheduled';
      }
    }

    pollsToInsert.push({
      question: pollData.question,
      options: JSON.stringify(pollData.options),
      start_ts: start_ts.toISOString(),
      end_ts: end_ts.toISOString(),
      status: status
    });
  }

  // REMAINING DAYS: Fill forward day-buckets in UTC
  const startDate = new Date(nowUtc);
  startDate.setUTCDate(startDate.getUTCDate() + 1);
  startDate.setUTCHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 29; dayOffset++) {
    const currentDay = new Date(startDate);
    currentDay.setUTCDate(currentDay.getUTCDate() + dayOffset);

    for (let pollIndex = 0; pollIndex < DAILY_POLL_COUNT; pollIndex++) {
      const questionIndex = (dayOffset + 1) * DAILY_POLL_COUNT + pollIndex;
      if (questionIndex >= pollsData.length) break;

      const pollData = pollsData[questionIndex];
      
      // Non-overlapping time windows
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
      start_ts.setUTCHours(startHour, 0, 0, 0);

      const end_ts = new Date(start_ts);
      end_ts.setUTCHours(end_ts.getUTCHours() + durationHours);

      // All future polls are scheduled
      const status = 'scheduled';

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

  // Show live polls
  const { data: livePolls } = await supabase
    .from('poll')
    .select('question, start_ts, end_ts')
    .eq('status', 'live')
    .order('start_ts', { ascending: true });

  if (livePolls && livePolls.length > 0) {
    console.log('\n🎯 Currently LIVE polls:');
    livePolls.forEach((poll, idx) => {
      console.log(`   ${idx + 1}. ${poll.question}`);
      console.log(`      Ends: ${new Date(poll.end_ts).toLocaleString()}`);
    });
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