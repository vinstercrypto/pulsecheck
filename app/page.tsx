import VoteComponent from '@/components/VoteComponent';
import { LivePollResponse } from '@/lib/types';
import { supabase } from '@/lib/db';

async function getLivePoll(): Promise<LivePollResponse> {
  const now = new Date().toISOString();

  const { data: livePoll, error } = await supabase
    .from('poll')
    .select('*')
    .eq('status', 'live')
    .lte('start_ts', now)
    .gte('end_ts', now)
    .limit(1)
    .single();

  if (error || !livePoll) {
    return { poll: null };
  }

  // Parse options from JSON to array
  const parsedPoll = {
    ...livePoll,
    options: typeof livePoll.options === 'string' 
      ? JSON.parse(livePoll.options) 
      : livePoll.options
  };

  return { poll: parsedPoll };
}

export default async function HomePage() {
  const { poll, starts_in_seconds } = await getLivePoll();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Today's Pulse</h1>
      <p className="text-center text-brand-gray-400 mb-8">One human, one vote. Powered by World ID.</p>
      
      {poll ? (
        <VoteComponent poll={poll} />
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