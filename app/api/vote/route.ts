import { NextResponse } from "next/server";
import { supabase=pulsecheckApp } from "@/lib/db";
import { verifyProof } from "@/lib/worldid";
import { getEasternTodayWindow } from "@/lib/time";
import type { Poll } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pollId, optionIdx, proof } = body || {};

    console.log("Vote request received:", { pollId, optionIdx, hasProof: !!proof });

    if (!pollId || typeof optionIdx !== "number" || !proof) {
      console.error("Bad request - missing fields:", { pollId, optionIdx: typeof optionIdx, hasProof: !!proof });
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    // Load poll
    const { data: poll, error: pollError } = await supabase
      .from("poll")
      .select("id, options, start_ts, end_ts, status")
      .eq("id", pollId)
      .single<Pick<Poll, "id" | "options" | "start_ts" | "end_ts" | "status">>();
    if (pollError || !poll) {
      console.error("Poll not found:", pollError);
      return NextResponse.json({ error: "poll_not_found" }, { status: 404 });
    }

    // Options as array
    const options =
      Array.isArray(poll.options)
        ? (poll.options as unknown as string[])
        : ((): string[] => {
            try { return JSON.parse(poll.options as unknown as string); } catch { return []; }
          })();
    if (!Array.isArray(options) || optionIdx < 0 || optionIdx >= options.length) {
      console.error("Invalid option:", { optionIdx, optionsLength: options.length });
      return NextResponse.json({ error: "invalid_option" }, { status: 400 });
    }

    // Time window: today ET + poll window
    const { start: dayStart, end: dayEnd } = getEasternTodayWindow();
    const now = new Date();
    const ps = new Date(poll.start_ts);
    const pe = new Date(poll.end_ts);
    
    // Debug timezone logic
    console.log("=== TIMEZONE DEBUG ===");
    console.log("Current UTC time:", now.toISOString());
    console.log("Eastern day start:", dayStart.toISOString());
    console.log("Eastern day end:", dayEnd.toISOString());
    console.log("Poll start:", ps.toISOString());
    console.log("Poll end:", pe.toISOString());
    console.log("Now < dayStart:", now < dayStart);
    console.log("Now > dayEnd:", now > dayEnd);
    console.log("ps <= now:", ps <= now);
    console.log("now < pe:", now < pe);
    
    if (now < dayStart || now > dayEnd) {
      console.error("Outside ET day window");
      return NextResponse.json({ error: "closed" }, { status: 403 });
    }
    if (!(ps <= now && now < pe)) {
      console.error("Outside poll window");
      return NextResponse.json({ error: "closed" }, { status: 403 });
    }

    // Verify with SAME signal = raw pollId (no prefixes)
    const actionId = process.env.WLD_ACTION_ID_VOTE!;
    const v = await verifyProof(proof, actionId, pollId);
    if (!v.isHuman || !v.nullifier_hash) {
      console.error("Verification failed:", v);
      return NextResponse.json({ error: "verify" }, { status: 401 });
    }
    const nullifier = v.nullifier_hash; // already lowercased

    // Insert; rely on PK (poll_id, nullifier_hash)
    const { error: insErr } = await supabase
      .from("vote")
      .insert({ poll_id: pollId, nullifier_hash: nullifier, option_idx: optionIdx });

    // Aggregates (same shape for 200 and 409)
    const { data: results, error: resErr } = await supabase
      .from("poll_results")
      .select("counts, total_votes")
      .eq("poll_id", pollId)
      .single();

    let totalsPerOption: number[] = Array(options.length).fill(0);
    let totalVotes = 0;
    if (!resErr && results) {
      totalsPerOption = options.map((_, i) => {
        const row = (results.counts || []).find((c: { option_idx: number }) => c.option_idx === i);
        return row ? Number(row.count) : 0;
      });
      totalVotes = Number(results.total_votes ?? totalsPerOption.reduce((a: number, b: number) => a + b, 0));
    } else {
      // fallback direct count
      const { data: raw } = await supabase.from("vote").select("option_idx").eq("poll_id", pollId);
      for (const r of raw ?? []) totalsPerOption[(r as any).option_idx] += 1;
      totalVotes = totalsPerOption.reduce((a, b) => a + b, 0);
    }

    // Map unique violation → 409; else 200; never send duplicate error text
    if (insErr) {
      if ((insErr as any).code === "23505") {
        console.log("vote", pollId, nullifier, "→ 409 duplicate");
        return NextResponse.json({ totalsPerOption, totalVotes }, { status: 409 });
      }
      console.error("vote insert error", insErr);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }

    console.log("vote", pollId, nullifier, "→ 200 ok");
    return NextResponse.json({ totalsPerOption, totalVotes }, { status: 200 });
  } catch (e) {
    console.error("Vote API exception:", e);
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}