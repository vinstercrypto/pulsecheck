import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function POST(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  const provided = request.headers.get("x-admin-token");
  if (!adminToken || provided !== adminToken) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { pollId, nullifierHash, all } = body || {};
    if (!pollId) {
      return NextResponse.json({ error: "pollId_required" }, { status: 400 });
    }

    if (all === true) {
      const { error } = await supabase.from("vote").delete().eq("poll_id", pollId);
      if (error) throw error;
      return NextResponse.json({ ok: true, deleted: "all" });
    }

    if (!nullifierHash) {
      return NextResponse.json({ error: "nullifierHash_required_without_all" }, { status: 400 });
    }

    const { error } = await supabase
      .from("vote")
      .delete()
      .eq("poll_id", pollId)
      .eq("nullifier_hash", nullifierHash);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("reset-vote error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}


