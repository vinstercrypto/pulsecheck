
import ResultsList from "@/components/ResultsList";
import { PollWithResults } from "@/lib/types";

async function getResults(): Promise<PollWithResults[]> {
    const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    try {
        // Fix: Cast fetch options to `any` to allow Next.js-specific `next` property
        // and prevent TypeScript error "Property 'next' does not exist in type 'RequestInit'".
        const res = await fetch(`${host}/api/results?days=7`, {
            next: { revalidate: 60 } // Revalidate every minute
        } as any);
        if (!res.ok) {
            return [];
        }
        return res.json();
    } catch (error) {
        console.error("Failed to fetch results:", error);
        return [];
    }
}

export default async function ResultsPage() {
    const polls = await getResults();

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2 text-white">Recent Polls</h1>
            <p className="text-center text-brand-gray-400 mb-8">Results from the last 7 days.</p>
            {polls.length > 0 ? (
                <ResultsList polls={polls} />
            ) : (
                <div className="bg-brand-gray-900 rounded-lg p-8 text-center">
                    <h2 className="text-xl font-semibold text-brand-gray-200">No recent polls found.</h2>
                    <p className="text-brand-gray-300">Check back later for new results.</p>
                </div>
            )}
        </div>
    );
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';