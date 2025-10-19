'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Poll, PollWithResults } from '@/lib/types';
import {
  MiniKit,
  VerifyCommandInput,
  VerificationLevel,
  ISuccessResult,
} from '@worldcoin/minikit-js';

interface VoteComponentProps {
  poll: Poll;
}

type VoteState = "idle" | "submitting" | "voted" | "duplicate" | "closed";

const ProgressBar = ({ percent, label }: { percent: number; label: string }) => (
  <div className="w-full bg-brand-gray-700 rounded-full h-8 flex items-center relative overflow-hidden">
    <div
      className="bg-blue-500 h-8 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${percent}%` }}
    />
    <span className="absolute left-3 right-3 flex justify-between items-center text-sm font-medium text-white">
      <span>{label}</span>
      <span>{percent.toFixed(1)}%</span>
    </span>
  </div>
);

export default function VoteComponent({ poll }: VoteComponentProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteState, setVoteState] = useState<VoteState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PollWithResults | null>(null);

  const actionId = process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE || 'vote';

  // Check localStorage on mount
  useEffect(() => {
    const votedKey = `voted:${poll.id}`;
    const hasVoted = localStorage.getItem(votedKey) === "1";
    
    if (hasVoted) {
      setVoteState("duplicate");
      // Load current aggregates for this poll
      loadPollResults();
    }
  }, [poll.id]);

  const loadPollResults = async () => {
    try {
      const response = await fetch('/api/results?days=1');
      const allResults = await response.json();
      const pollResult = allResults.find((p: any) => p.id === poll.id);
      
      if (pollResult) {
        setResults(pollResult);
      }
    } catch (error) {
      console.error('Failed to load poll results:', error);
    }
  };

  const handleVerifyClick = async () => {
    if (selectedOption === null || voteState !== "idle") return;
    if (!MiniKit.isInstalled()) {
      setError('Open this in World App. Orb-verified humans only.');
      return;
    }

    setVoteState("submitting");
    setError(null);

    try {
      const signal = `poll-${poll.id}`;
      const verifyPayload: VerifyCommandInput = {
        action: actionId,
        signal: signal,
        verification_level: VerificationLevel.Orb,
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        setError(finalPayload.error_code || 'Verification failed');
        setVoteState("idle");
        return;
      }

      console.log('MiniKit verification successful');
      await handleVote(finalPayload as ISuccessResult, actionId, signal);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(`Verification failed: ${err?.message ?? String(err)}`);
      setVoteState("idle");
    }
  };

  const handleVote = async (payload: ISuccessResult, action: string, signal: string) => {
    if (selectedOption === null) return;

    try {
      const proof = {
        nullifier_hash: payload.nullifier_hash,
        merkle_root: payload.merkle_root,
        proof: payload.proof,
        verification_level: payload.verification_level,
      };

      console.log('Submitting vote with proof');

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: poll.id,
          optionIdx: selectedOption,
          proof,
          signal,
          action: actionId,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Success - first vote
        setVoteState("voted");
        localStorage.setItem(`voted:${poll.id}`, "1");
        
        if (typeof data.totalVotes === 'number' && Array.isArray(data.totalsPerOption)) {
          const pollResults: PollWithResults = {
            ...poll,
            counts: data.totalsPerOption.map((count: number, index: number) => ({
              option_idx: index,
              count,
            })),
            total_votes: data.totalVotes,
          };
          setResults(pollResults);
        }
      } else if (res.status === 409) {
        // Duplicate vote - show aggregates
        setVoteState("duplicate");
        localStorage.setItem(`voted:${poll.id}`, "1");
        
        if (typeof data.totalVotes === 'number' && Array.isArray(data.totalsPerOption)) {
          const pollResults: PollWithResults = {
            ...poll,
            counts: data.totalsPerOption.map((count: number, index: number) => ({
              option_idx: index,
              count,
            })),
            total_votes: data.totalVotes,
          };
          setResults(pollResults);
        }
      } else if (res.status === 403) {
        // Closed window
        setVoteState("closed");
      } else {
        // Other errors
        setError(data.error ?? 'Vote failed');
        setVoteState("idle");
      }
    } catch (err: any) {
      setError(`Vote submission failed: ${err?.message ?? String(err)}`);
      setVoteState("idle");
      console.error('Vote submission failed:', err);
    }
  };

  const pollResultsData = useMemo(() => {
    if (!results) return null;
    const totalVotes = results.total_votes;
    return results.options.map((option, index) => {
      const voteInfo = results.counts.find((c) => c.option_idx === index);
      const count = voteInfo ? voteInfo.count : 0;
      const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
      return { label: option, percentage, count };
    });
  }, [results]);

  const getBannerMessage = () => {
    switch (voteState) {
      case "voted":
        return "Thanks for your vote—come back tomorrow for new questions.";
      case "duplicate":
        return "You've already voted today.";
      case "closed":
        return "Voting is closed. New questions arrive at 12:00 AM Eastern.";
      default:
        return null;
    }
  };

  const getBannerColor = () => {
    switch (voteState) {
      case "voted":
        return "bg-green-900 border-green-700 text-green-200";
      case "duplicate":
        return "bg-yellow-900 border-yellow-700 text-yellow-200";
      case "closed":
        return "bg-red-900 border-red-700 text-red-200";
      default:
        return "";
    }
  };

  const isDisabled = voteState !== "idle";

  if (results && pollResultsData) {
    return (
      <div className="bg-brand-gray-900 rounded-lg p-6 shadow-lg w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">{results.question}</h2>
        <div className="space-y-3">
          {pollResultsData.map((res, index) => (
            <div key={index}>
              <ProgressBar percent={res.percentage} label={res.label} />
              <p className="text-xs text-brand-gray-400 text-right mt-1">
                {res.count.toLocaleString()} votes
              </p>
            </div>
          ))}
        </div>
        <p className="text-center mt-6 text-brand-gray-300 font-medium">
          Total Votes: {results.total_votes.toLocaleString()}
        </p>
        {getBannerMessage() && (
          <div className={`mt-4 p-4 border rounded-lg text-center ${getBannerColor()}`}>
            {getBannerMessage()}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-brand-gray-900 rounded-lg p-6 shadow-lg w-full">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">{poll.question}</h2>
      <div className="space-y-3 mb-6">
        {poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            disabled={isDisabled}
            className={`w-full p-4 rounded-lg text-left font-medium transition-all duration-200 border-2 ${
              selectedOption === index
                ? 'bg-blue-500 border-blue-400 text-white'
                : isDisabled
                ? 'bg-brand-gray-600 border-brand-gray-500 text-brand-gray-400 cursor-not-allowed'
                : 'bg-brand-gray-800 border-brand-gray-700 hover:border-blue-500'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200 text-center">
          {error}
        </div>
      )}

      {getBannerMessage() && (
        <div className={`mb-4 p-4 border rounded-lg text-center ${getBannerColor()}`}>
          {getBannerMessage()}
        </div>
      )}

      <button
        onClick={handleVerifyClick}
        disabled={selectedOption === null || isDisabled || voteState === "submitting"}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-brand-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {voteState === "submitting" ? 'Verifying...' : 'Verify & Cast Vote'}
      </button>
    </div>
  );
}