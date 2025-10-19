import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

// IMPORTANT: Make sure your .env.local has your PRODUCTION Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('=== PRODUCTION SEED ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Using SERVICE_ROLE_KEY:', supabaseKey ? 'Yes (length: ' + supabaseKey.length + ')' : 'NO - MISSING!');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Missing Supabase credentials in .env.local');
  console.error('Make sure these are set:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read DAILY_POLL_COUNT from env, default to 1
const dailyPollCountRaw = process.env.DAILY_POLL_COUNT || '1';
const DAILY_POLL_COUNT = parseInt(dailyPollCountRaw);

if (![1, 2].includes(DAILY_POLL_COUNT)) {
  throw new Error('DAILY_POLL_COUNT must be 1 or 2');
}

interface PollQuestion {
  question: string;
  options: string[];
}

async function seedProduction() {
  console.log('\n🌱 Starting production seed...');
  console.log(`📊 DAILY_POLL_COUNT: ${DAILY_POLL_COUNT}`);

  // Check connection first
  console.log('\n🔌 Testing database connection...');
  const { data: testData, error: testError } = await supabase
    .from('poll')
    .select('count')
    .limit(1);
  
  if (testError) {
    console.error('❌ Database connection failed:', testError.message);
    console.error('Check your Supabase credentials!');
    process.exit(1);
  }
  
  console.log('✅ Database connection successful!');

  // Clear existing data
  console.log('\n🧹 Clearing existing polls and votes...');
  await supabase.from('vote').delete().neq('poll_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('poll').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Old data cleared');

  // Load questions from data/polls.json
  const dataPath = path.join(process.cwd(), 'data', 'polls.json');
  console.log('\n📖 Loading questions from:', dataPath);
  const pollsData: PollQuestion[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`✅ Loaded ${pollsData.length} questions`);

  if (pollsData.length < 30 * DAILY_POLL_COUNT) {
    console.warn(`⚠️  Warning: Need at least ${30 * DAILY_POLL_COUNT} questions for 30 days, found ${pollsData.length}`);
  }

  // Generate 30 days of polls
  const pollsToInsert = [];
  const now = new Date();
  
  // Start from 15 days ago to have historical data
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 15);
  startDate.setHours(0, 0, 0, 0);

  console.log('\n📅 Generating polls...');
  console.log(`Starting from: ${startDate.toISOString()}`);
  console.log(`Current time: ${now.toISOString()}`);

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() + dayOffset);

    for (let pollIndex = 0; pollIndex < DAILY_POLL_COUNT; pollIndex++) {
      const questionIndex = dayOffset * DAILY_POLL_COUNT + pollIndex;
      if (questionIndex >= pollsData.length) {
        break;
      }

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

  console.log(`\n📝 Inserting ${pollsToInsert.length} polls into database...`);

  // Insert in batches of 100
  for (let i = 0; i < pollsToInsert.length; i += 100) {
    const batch = pollsToInsert.slice(i, i + 100);
    const { error } = await supabase.from('poll').insert(batch);
    
    if (error) {
      console.error(`❌ Error inserting batch ${i / 100 + 1}:`, error);
      throw error;
    }
    
    console.log(`✅ Inserted batch ${i / 100 + 1} (${batch.length} polls)`);
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
    
    console.log('\n📊 Poll counts by status:');
    console.log(`   🔵 Scheduled: ${counts.scheduled || 0}`);
    console.log(`   🟢 Live: ${counts.live || 0}`);
    console.log(`   ⚫ Closed: ${counts.closed || 0}`);
    console.log(`   📈 Total: ${statusCounts.length}`);
  }

  // Show which poll(s) are currently live
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
  } else {
    console.log('\n⚠️  No polls are currently live.');
    console.log('The next poll will go live at the next scheduled time (09:00 UTC)');
  }
}

seedProduction()
  .then(() => {
    console.log('\n✅ Production seed completed successfully!');
    console.log('🚀 Your app should now show live polls on Vercel!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Production seed failed:', error);
    process.exit(1);
  });

