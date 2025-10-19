import VoteComponent from "@/components/VoteComponent";
import { Poll } from "@/lib/types";
import { supabase } from "@/lib/db";
import { getEasternTodayWindow } from "@/lib/time";

interface LivePollsResponse {
  polls: Poll[];
  starts_in_seconds?: number;
}

async function getLivePolls(): Promise<LivePollsResponse> {
  const dailyPollCount = parseInt(process.env.DAILY_POLL_COUNT || "1", 10);
  const { start: easternDayStart, end: easternDayEnd } = getEasternTodayWindow();

  // live polls overlapping today's ET window
  const { data: livePolls, error } = await supabase
    .from("poll")
    .select("*")
    .eq("status", "live")
    .lte("start_ts", easternDayEnd.toISOString())
    .gte("end_ts", easternDayStart.toISOString())
    .order("start_ts", { ascending: true })
    .limit(dailyPollCount);

  if (!error && livePolls?.length) {
    const parsedPolls: Poll[] = livePolls.map((p: any) => ({
      ...p,
      options: typeof p.options === "string" ? JSON.parse(p.options) : p.options,
    }));
    return { polls: parsedPolls };
  }

  // next scheduled poll after today's ET window
  const { data: scheduledPolls } = await supabase
    .from("poll")
    .select("*")
    .eq("status", "scheduled")
    .gt("start_ts", easternDayEnd.toISOString())
    .order("start_ts", { ascending: true })
    .limit(1);

  if (scheduledPolls?.length) {
    const nextPoll = scheduledPolls[0];
    const startsInSeconds =
      (new Date(nextPoll.start_ts).getTime() - Date.now()) / 1000;
    return { polls: [], starts_in_seconds: startsInSeconds };
  }

  return { polls: [] };
}

export default async function HomePage() {
  const { polls, starts_in_seconds } = await getLivePolls();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">Today&apos;s Pulse</h1>
      <p className="text-center text-brand-gray-400 mb-8">One human, one vote. Powered by World ID.</p>

      {polls.length > 0 ? (
        <div className="space-y-6">
          {polls.map((poll) => (
            <VoteComponent key={poll.id} poll={poll} />
          ))}
        </div>
      ) : starts_in_seconds !== undefined ? (
        <div className="bg-brand-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-brand-gray-200">The next poll is coming soon.</h2>
          <p className="text-brand-gray-300">
            Check back in ~{Math.ceil(starts_in_seconds / 60)} minutes.
          </p>
        </div>
      ) : (
        <div className="bg-brand-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-brand-gray-200">No active poll right now.</h2>
          <p className="text-brand-gray-300">Please check back later.</p>
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
