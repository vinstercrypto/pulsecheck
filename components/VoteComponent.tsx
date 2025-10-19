"use client";

import { useEffect, useMemo, useState } from "react";
import type { Poll } from "@/lib/types";

type VoteState = "idle" | "submitting" | "voted" | "duplicate" | "closed" | "error";

interface Props {
  poll: Poll; // { id: string; question: string; options: string[]; ... }
}

export default function VoteComponent({ poll }: Props) {
  const [state, setState] = useState<VoteState>("idle");
  const [banner, setBanner] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [totalsPerOption, setTotalsPerOption] = useState<number[] | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  const votedKey = useMemo(() => `voted:${poll.id}`, [poll.id]);

  // Pre-disable if already voted on this poll (persist across navigation/refresh)
  useEffect(() => {
    const already = typeof window !== "undefined" && localStorage.getItem(votedKey) === "1";
    if (already) {
      setState("duplicate");
      setBanner("You’ve already voted today.");
      // Optionally fetch current aggregates for this poll if your API exposes them
      // For now we leave bars empty until user votes once in session
    }
  }, [votedKey]);

  async function handleVote(optionIdx: number) {
    if (state !== "idle") return; // buttons disabled when not idle
    setSubmitting(true);

    try {
      // 1) World App verify WITH signal = poll.id
      // MiniKit is injected in World App webview; keep this generic
      const mini = (window as any).MiniKit;
      if (!mini?.verify) {
        setState("error");
        setBanner("Verification not available. Open inside World App.");
        return;
      }

      const proof = await mini.verify({
        action: process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE!,
        signal: poll.id, // CRITICAL: binds nullifier to this poll
      });

      // 2) POST to server
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pollId: poll.id, optionIdx, proof }),
      });
      const payload = await res.json();

      if (res.status === 200) {
        // First vote success
        lockOut(payload, "Thanks for your vote—come back tomorrow for new questions.", "voted");
        return;
      }

      if (res.status === 409) {
        // Duplicate vote (server conflict on PK)
        lockOut(payload, "You’ve already voted today.", "duplicate");
        return;
      }

      if (res.status === 403) {
        setState("closed");
        setBanner("Voting is closed. New questions arrive at 12:00 AM Eastern.");
        return;
      }

      if (res.status === 401) {
        setState("error");
        setBanner("Verification failed. Please verify in World App and try again.");
        return;
      }

      setState("error");
      setBanner("Something went wrong. Try again later.");
    } catch {
      setState("error");
      setBanner("Verification failed. Please try again inside World App.");
    } finally {
      setSubmitting(false);
    }
  }

  function lockOut(payload: any, message: string, finalState: VoteState) {
    try {
      if (payload?.totalsPerOption) setTotalsPerOption(payload.totalsPerOption);
      if (typeof payload?.totalVotes === "number") setTotalVotes(payload.totalVotes);
    } catch {}
    localStorage.setItem(votedKey, "1");
    setBanner(message);
    setState(finalState);
  }

  const disabled = submitting || state !== "idle";

  return (
    <div className="bg-brand-gray-900 rounded-lg p-6">
      {banner ? (
        <div className="mb-4 rounded-md border border-brand-gray-700 bg-brand-gray-800 px-4 py-3 text-brand-gray-100">
          {banner}
        </div>
      ) : null}

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
                  <span>
                    {count} • {pct}%
                  </span>
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
