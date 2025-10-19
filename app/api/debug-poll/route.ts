import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getEasternTodayWindow } from "@/lib/time";

export async function GET() {
  try {
    const now = new Date();
    const { start: dayStart, end: dayEnd } = getEasternTodayWindow();
    
    // Get the current live poll
    const { data: poll, error } = await supabase
      .from("poll")
      .select("*")
      .eq("status", "live")
      .single();
    
    if (error || !poll) {
      return NextResponse.json({
        message: "No live poll found",
        current_time: now.toISOString(),
        eastern_day_start: dayStart.toISOString(),
        eastern_day_end: dayEnd.toISOString(),
        error: error?.message
      });
    }
    
    const pollStart = new Date(poll.start_ts);
    const pollEnd = new Date(poll.end_ts);
    
    return NextResponse.json({
      message: "Current poll status",
      current_time: now.toISOString(),
      eastern_day_start: dayStart.toISOString(),
      eastern_day_end: dayEnd.toISOString(),
      poll: {
        id: poll.id,
        question: poll.question,
        status: poll.status,
        start_ts: poll.start_ts,
        end_ts: poll.end_ts,
        start_date: pollStart.toISOString(),
        end_date: pollEnd.toISOString()
      },
      time_checks: {
        within_eastern_day: now >= dayStart && now <= dayEnd,
        within_poll_window: pollStart <= now && now < pollEnd,
        poll_started: pollStart <= now,
        poll_ended: now >= pollEnd
      }
    });
  } catch (error) {
    console.error("Debug poll error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
