
import VoteComponent from '@/components/VoteComponent';
import { LivePollResponse } from '@/lib/types';

async function getLivePoll(): Promise<LivePollResponse> {
  const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  // Fix: Cast fetch options to `any` to allow Next.js-specific `next` property
  // and prevent TypeScript error "Property 'next' does not exist in type 'RequestInit'".
  const res = await fetch(`${host}/api/polls/live`, {
    next: { revalidate: 30 } // Revalidate every 30 seconds
  } as any);

  if (!res.ok) {
    console.error('Failed to fetch live poll');
    return { poll: null };
  }
  return res.json();
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

// Enable dynamic rendering
export const dynamic = 'force-dynamic';