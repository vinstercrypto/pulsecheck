'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Poll, PollWithResults } from '@/lib/types';
import {
  MiniKit,
  VerifyCommandInput,
  VerificationLevel,
  ISuccessResult,
} from '@worldcoin/minikit-js';
import { Banner } from "@/components/ui/Banner";

interface VoteComponentProps {
  poll: Poll;
}

const MSG_THANKS  = "Thanks for your vote! Check back tomorrow for new questions.";
const MSG_ALREADY = "You've already voted today. New poll arrives at 12:00 AM Eastern.";
const MSG_CLOSED  = "Voting is closed. New questions arrive at 12:00 AM Eastern.";
const MSG_VERIFY  = "Verification failed. Please verify in World App and try again.";
const MSG_GENERIC = "Something went wrong. Try again later.";

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
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState<string>("");
  const [bannerKind, setBannerKind] = useState<"success" | "info" | "warning" | "error">("info");
  const [results, setResults] = useState<PollWithResults | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const actionId = process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE || 'vote';

  function dismiss() { setBanner(""); }

  // Check localStorage on mount
  useEffect(() => {
    const votedKey = `voted:${poll.id}`;
    const voted = localStorage.getItem(votedKey) === "1";
    
    if (voted) {
      setHasVoted(true);
      setBanner(MSG_ALREADY);
      setBannerKind("info");
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
    if (selectedOption === null || hasVoted) return;
    if (!MiniKit.isInstalled()) {
      setBanner(MSG_VERIFY);
      setBannerKind("error");
      return;
    }

    setIsLoading(true);
    setBanner("");

    try {
      // Use poll.id directly as signal (no prefix)
      const signal = poll.id;
      const verifyPayload: VerifyCommandInput = {
        action: actionId,
        signal: signal,
        verification_level: VerificationLevel.Orb,
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        setBanner(MSG_VERIFY);
        setBannerKind("error");
        setIsLoading(false);
        return;
      }

      console.log('MiniKit verification successful');
      await handleVote(finalPayload as ISuccessResult);
    } catch (err: any) {
      console.error('Verification error:', err);
      setBanner(MSG_VERIFY);
      setBannerKind("error");
      setIsLoading(false);
    }
  };

  const handleVote = async (payload: ISuccessResult) => {
    if (selectedOption === null) return;

    try {
      const proof = {
        nullifier_hash: payload.nullifier_hash,
        merkle_root: payload.merkle_root,
        proof: payload.proof,
        verification_level: payload.verification_level,
      };

      console.log('Submitting vote with proof for poll:', poll.id);
      console.log('Option index:', selectedOption);

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: poll.id,
          optionIdx: selectedOption,
          proof,
        }),
      });

      const data = await res.json();
      console.log('Vote response:', res.status, data);

      if (res.status === 200) {
        // Success - first vote
        setHasVoted(true);
        setBanner(MSG_THANKS);
        setBannerKind("success");
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
        setHasVoted(true);
        setBanner(MSG_ALREADY);
        setBannerKind("info");
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
        setBanner(MSG_CLOSED);
        setBannerKind("warning");
      } else if (res.status === 401) {
        setBanner(MSG_VERIFY);
        setBannerKind("error");
      } else if (res.status === 400) {
        console.error('Bad request error:', data);
        setBanner(MSG_GENERIC);
        setBannerKind("error");
      } else {
        // Other errors
        console.error('Vote error response:', data);
        setBanner(data.error || MSG_GENERIC);
        setBannerKind("error");
      }
    } catch (err: any) {
      console.error('Vote submission failed:', err);
      setBanner(MSG_GENERIC);
      setBannerKind("error");
    } finally {
      setIsLoading(false);
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

  if (results && pollResultsData) {
    return (
      <div className="bg-brand-gray-900 rounded-lg p-6 shadow-lg w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">{results.question}</h2>
        
        {banner && (
          <Banner 
            kind={bannerKind} 
            message={banner} 
            onClose={dismiss} 
          />
        )}
        
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
      </div>
    );
  }

  return (
    <div className="bg-brand-gray-900 rounded-lg p-6 shadow-lg w-full">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">{poll.question}</h2>
      
      {banner && (
        <Banner 
          kind={bannerKind} 
          message={banner} 
          onClose={dismiss} 
        />
      )}
      
      <div className="space-y-3 mb-6">
        {poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(index)}
            disabled={hasVoted}
            className={`w-full p-4 rounded-lg text-left font-medium transition-all duration-200 border-2 ${
              selectedOption === index
                ? 'bg-blue-500 border-blue-400 text-white'
                : hasVoted
                ? 'bg-brand-gray-600 border-brand-gray-500 text-brand-gray-400 cursor-not-allowed'
                : 'bg-brand-gray-800 border-brand-gray-700 hover:border-blue-500'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleVerifyClick}
        disabled={selectedOption === null || hasVoted || isLoading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-brand-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {isLoading ? 'Verifying...' : 'Verify & Cast Vote'}
      </button>
    </div>
  );
}