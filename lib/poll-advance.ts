import { supabase } from "./db";

/**
 * Advance poll statuses based on current time:
 * - scheduled → live when start_ts <= now < end_ts
 * - live → closed when end_ts < now
 * 
 * Idempotent: safe to call multiple times.
 */
export async function advancePolls(): Promise<void> {
  const now = new Date().toISOString();

  // Close polls that have ended
  await supabase
    .from("poll")
    .update({ status: "closed" })
    .eq("status", "live")
    .lt("end_ts", now);

  // Activate scheduled polls that should be live
  await supabase
    .from("poll")
    .update({ status: "live" })
    .eq("status", "scheduled")
    .lte("start_ts", now)
    .gt("end_ts", now);
}

