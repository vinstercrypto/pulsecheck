import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { verifyProof } from "@/lib/worldid";
import { getEasternTodayWindow } from "@/lib/time";
import type { Poll } from "@/lib/types";

/**
 * Contract:
 * 200 -> { totalsPerOption, totalVotes } on first vote
 * 409 -> { totalsPerOption, totalVotes } if same human re-votes same poll
 * 403 -> { error: "closed" } outside window
 * 401 -> { error: "verify" } verification failed
 * 400/404/500 -> structured errors for bad requests
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pollId, optionIdx, proof } = body || {};

    if (!pollId || typeof optionIdx !== "number" || !proof) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    // 1) Load poll (options, window)
    const { data: poll, error: pollError } = await supabase
      .from("poll")
      .select("id, options, start_ts, end_ts, status")
      .eq("id", pollId)
      .single<Pick<Poll, "id" | "options" | "start_ts" | "end_ts" | "status">>();

    if (pollError || !poll) {
      return NextResponse.json({ error: "poll_not_found" }, { status: 404 });
    }

    // Parse options (array)
    let options: string[] = Array.isArray(poll.options)
      ? (poll.options as unknown as string[])
      : (() => {
          try {
            return JSON.parse(poll.options as unknown as string);
          } catch {
            return [];
          }
        })();

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "invalid_poll_options" }, { status: 500 });
    }
    if (optionIdx < 0 || optionIdx >= options.length) {
      return NextResponse.json({ error: "invalid_option" }, { status: 400 });
    }

    // 2) Time window (Eastern day and poll’s own window)
    const { start: easternDayStart, end: easternDayEnd } = getEasternTodayWindow();
    const now = new Date();
    const pollStart = new Date(poll.start_ts);
    const pollEnd = new Date(poll.end_ts);

    // Must be within TODAY's ET window AND within the poll's specific window
    if (now < easternDayStart || now > easternDayEnd) {
      return NextResponse.json({ error: "closed" }, { status: 403 });
    }
    if (!(pollStart <= now && now < pollEnd)) {
      return NextResponse.json({ error: "closed" }, { status: 403 });
    }

    // 3) World ID Verify v2 with SAME signal = pollId
    const actionId = process.env.WLD_ACTION_ID_VOTE!;
    const verify = await verifyProof(proof, actionId, pollId);
    if (!verify.isHuman || !verify.nullifier_hash) {
      return NextResponse.json({ error: "verify" }, { status: 401 });
    }
    const nullifier = verify.nullifier_hash; // already lowercase

    // 4) Insert vote; unique (poll_id, nullifier_hash) enforced in DB
    const { error: voteError } = await supabase
      .from("vote")
      .insert({ poll_id: pollId, nullifier_hash: nullifier, option_idx: optionIdx });

    // 5) Aggregates (always return the same shape on 200/409)
    const { data: results, error: resultsError } = await supabase
      .from("poll_results")
      .select("counts, total_votes")
      .eq("poll_id", pollId)
      .single();

    // Fallback if view not present
    let totalsPerOption: number[] = Array(options.length).fill(0);
    let totalVotes = 0;

    if (!resultsError && results) {
      totalsPerOption = options.map((_, i) => {
        const row = (results.counts || []).find((c: { option_idx: number }) => c.option_idx === i);
        return row ? Number(row.count) : 0;
      });
      totalVotes = Number(results.total_votes ?? totalsPerOption.reduce((a: number, b: number) => a + b, 0));
    } else {
      // fallback direct count: vote(option_idx) for this poll
      const { data: rawRows } = await supabase
        .from("vote")
        .select("option_idx")
        .eq("poll_id", pollId);
      for (const r of rawRows ?? []) totalsPerOption[(r as any).option_idx] += 1;
      totalVotes = totalsPerOption.reduce((a, b) => a + b, 0);
    }

    // Map unique violation to 409 with aggregates; else 200
    if (voteError) {
      if ((voteError as any).code === "23505") {
        return NextResponse.json({ totalsPerOption, totalVotes }, { status: 409 });
      }
      // Unexpected insert error
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }

    return NextResponse.json({ totalsPerOption, totalVotes }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
