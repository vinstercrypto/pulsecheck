import ResultsList from "@/components/ResultsList";
import { PollWithResults } from "@/lib/types";
import { supabase } from '@/lib/db';
import { advancePolls } from '@/lib/poll-advance';

async function getResults(): Promise<PollWithResults[]> {
    try {
        // Update poll statuses before fetching results
        await advancePolls();
        
        const days = 7;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const { data, error } = await supabase
            .from('poll_results')
            .select('*')
            .in('status', ['live', 'closed'])
            .gte('start_ts', cutoffDate.toISOString())
            .order('start_ts', { ascending: false });

        if (error) {
            console.error('Error fetching results:', error);
            return [];
        }

        // Parse options from JSON string to array
        const parsedData = data?.map(poll => ({
            ...poll,
            id: poll.poll_id, // Map poll_id to id if needed
            options: typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options
        })) || [];

        return parsedData;
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

export const dynamic = 'force-dynamic';