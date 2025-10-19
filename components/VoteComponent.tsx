"use client";

import { useEffect, useMemo, useState } from "react";
import type { Poll } from "@/lib/types";

type VoteState = "idle" | "submitting" | "voted" | "duplicate" | "closed" | "error";

// Unified copy
const MSG_THANKS  = "Thanks for your vote — come back tomorrow for new questions.";
const MSG_ALREADY = "You’ve already voted today — new poll arrives at 12:00 AM Eastern.";
const MSG_CLOSED  = "Voting is closed. New questions arrive at 12:00 AM Eastern.";
const MSG_VERIFY  = "Verification failed. Please verify in World App and try again.";
const MSG_GENERIC = "Something went wrong. Try again later.";
const VOTED_FLAG  = (pollId: string) => `voted:${pollId}`;

interface Props { poll: Poll }

export default function VoteComponent({ poll }: Props) {
  const [state, setState] = useState<VoteState>("idle");
  const [banner, setBanner] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [totalsPerOption, setTotalsPerOption] = useState<number[] | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  const votedKey = useMemo(() => VOTED_FLAG(poll.id), [poll.id]);
  const disabled = submitting || state !== "idle";

  // Lockout on refresh/navigation if already voted
  useEffect(() => {
    const already = typeof window !== "undefined" && localStorage.getItem(votedKey) === "1";
    if (already) {
      setState("duplicate");
      setBanner(MSG_ALREADY);
    }
  }, [votedKey]);

  async function handleVote(optionIdx: number) {
    if (state !== "idle") return;
    setSubmitting(true);

    try {
      // 1) Verify in World App with signal=poll.id
      const mini = (window as any).MiniKit;
      if (!mini?.verify) {
        setState("error"); setBanner("Verification not available. Open inside World App."); return;
      }
      const proof = await mini.verify({
        action: process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE!,
        signal: poll.id, // CRITICAL: ties nullifier to this poll
      });

      // 2) Server vote
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionIdx, proof }),
      });

      // IMPORTANT: handle status FIRST; do not throw on 409
      const safeJson = async () => {
        try { return await res.json(); } catch { return {}; }
      };

      if (res.status === 200) {
        const payload = await safeJson();
        lockOut(payload, MSG_THANKS, "voted");
        return;
      }
      if (res.status === 409) {
        const payload = await safeJson(); // aggregates should be present; handle even if empty
        lockOut(payload, MSG_ALREADY, "duplicate");
        return;
      }
      if (res.status === 403) {
        setState("closed"); setBanner(MSG_CLOSED); return;
      }
      if (res.status === 401) {
        setState("error"); setBanner(MSG_VERIFY); return;
      }

      // any other status → generic, but DO NOT override duplicate/success banners
      setState("error"); setBanner(MSG_GENERIC);
    } catch {
      setState("error"); setBanner(MSG_VERIFY);
    } finally {
      setSubmitting(false);
    }
  }

  function lockOut(payload: any, message: string, finalState: VoteState) {
    // populate bars if provided
    try {
      if (payload?.totalsPerOption) setTotalsPerOption(payload.totalsPerOption);
      if (typeof payload?.totalVotes === "number") setTotalVotes(payload.totalVotes);
    } catch {}
    localStorage.setItem(votedKey, "1");
    setBanner(message);
    setState(finalState);
  }

  return (
    <div className="bg-brand-gray-900 rounded-lg p-6">
      {banner && (
        <div className="mb-4 rounded-md border border-brand-gray-700 bg-brand-gray-800 px-4 py-3 text-brand-gray-100">
          {banner}
        </div>
      )}

      <h2 className="text-xl font-semibold text-brand-gray-100 mb-4">{poll.question}</h2>

      <div className="space-y-3">
        {poll.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleVote(idx)}
            disabled={disabled}
            className={`w-full text-left rounded-md px-4 py-3 border ${
              disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-brand-gray-800"
            } border-brand-gray-700 text-brand-gray-100`}
          >
            {opt}
          </button>
        ))}
      </div>

      {totalsPerOption && (
        <div className="mt-6 space-y-2">
          {poll.options.map((opt, idx) => {
            const count = totalsPerOption[idx] ?? 0;
            const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm text-brand-gray-300">
                  <span>{opt}</span>
                  <span>{count} • {pct}%</span>
                </div>
                <div className="h-2 bg-brand-gray-800 rounded">
                  <div className="h-2 bg-blue-500 rounded" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
