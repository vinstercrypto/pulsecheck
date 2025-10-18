import VoteComponent from '@/components/VoteComponent';
import { Poll } from '@/lib/types';
import { supabase } from '@/lib/db';

interface LivePollsResponse {
  polls: Poll[];
  starts_in_seconds?: number;
}

async function getLivePolls(): Promise<LivePollsResponse> {
  const now = new Date().toISOString();
  
  // Get DAILY_POLL_COUNT from environment (default: 1)
  const dailyPollCount = parseInt(process.env.DAILY_POLL_COUNT || '1');

  // Get the start of today in UTC
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

  // Find polls that are live right now
  const { data: livePolls, error } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'live')
    .lte('start_ts', now)
    .gte('end_ts', now)
    .gte('start_ts', todayStart.toISOString())
    .lt('start_ts', tomorrowStart.toISOString())
    .order('start_ts', { ascending: true })
    .limit(dailyPollCount);

  if (!error && livePolls && livePolls.length > 0) {
    const parsedPolls = livePolls.map(poll => ({
      ...poll,
      options: typeof poll.options === 'string' 
        ? JSON.parse(poll.options) 
        : poll.options
    }));
    return { polls: parsedPolls };
  }

  // If no live polls, find the next scheduled poll
  const { data: scheduledPolls } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'scheduled')
    .gt('start_ts', now)
    .gte('start_ts', todayStart.toISOString())
    .lt('start_ts', tomorrowStart.toISOString())
    .order('start_ts', { ascending: true })
    .limit(1);

  if (scheduledPolls && scheduledPolls.length > 0) {
    const nextPoll = scheduledPolls[0];
    const startsInSeconds = (new Date(nextPoll.start_ts).getTime() - new Date().getTime()) / 1000;
    return { polls: [], starts_in_seconds: startsInSeconds };
  }

  return { polls: [] };
}

export default async function HomePage() {
  const { polls, starts_in_seconds } = await getLivePolls();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Today's Pulse</h1>
      <p className="text-center text-brand-gray-400 mb-8">One human, one vote. Powered by World ID.</p>
      
      {polls.length > 0 ? (
        <div className="space-y-6">
          {polls.map((poll) => (
            <VoteComponent key={poll.id} poll={poll} />
          ))}
        </div>
      ) : starts_in_seconds !== undefined ? (
        <div className="bg-brand-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-brand-gray-200">The next poll is coming soon!</h2>
          <p className="text-brand-gray-300">Check back in a bit. The next question goes live in approximately {Math.ceil(starts_in_seconds / 60)} minutes.</p>
        </div>
      ) : (
        <div className="bg-brand-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-brand-gray-200">No active poll right now.</h2>
          <p className="text-brand-gray-300">Please check back later for the next daily poll.</p>
        </div>
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';