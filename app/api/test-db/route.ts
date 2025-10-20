import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    console.log("=== DATABASE TEST ===");
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('poll')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error("Database connection error:", testError);
      return NextResponse.json({ error: "Database connection failed", details: testError.message }, { status: 500 });
    }
    
    // Get all polls with their status
    const { data: allPolls, error: allPollsError } = await supabase
      .from('poll')
      .select('id, question, status, start_ts, end_ts, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (allPollsError) {
      console.error("Error fetching polls:", allPollsError);
      return NextResponse.json({ error: "Failed to fetch polls", details: allPollsError.message }, { status: 500 });
    }
    
    // Get live polls specifically
    const { data: livePolls, error: livePollsError } = await supabase
      .from('poll')
      .select('id, question, status, start_ts, end_ts')
      .eq('status', 'live');
    
    if (livePollsError) {
      console.error("Error fetching live polls:", livePollsError);
      return NextResponse.json({ error: "Failed to fetch live polls", details: livePollsError.message }, { status: 500 });
    }
    
    return NextResponse.json({
      message: "Database test successful",
      connection: "OK",
      total_polls: allPolls?.length || 0,
      recent_polls: allPolls,
      live_polls: livePolls,
      live_polls_count: livePolls?.length || 0
    });
    
  } catch (error) {
    console.error("Test DB error:", error);
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
  }
}
