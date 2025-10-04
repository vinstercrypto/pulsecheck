'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Poll, PollWithResults } from '@/lib/types';

interface VoteComponentProps {
  poll: Poll;
}

const ProgressBar = ({ percent, label }: { percent: number; label: string }) => (
  <div className="w-full bg-brand-gray-700 rounded-full h-8 flex items-center relative overflow-hidden">
    <div
      className="bg-blue-500 h-8 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${percent}%` }}
    ></div>
    <span className="absolute left-3 right-3 flex justify-between items-center text-sm font-medium text-white">
      <span>{label}</span>
      <span>{percent.toFixed(1)}%</span>
    </span>
  </div>
);

export default function VoteComponent({ poll }: VoteComponentProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PollWithResults | null>(null);

  const actionId = process.env.NEXT_PUBLIC_WLD_ACTION_ID_VOTE!;

  const handleVerifyClick = async () => {
    if (selectedOption === null) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { MiniKit } = await import('@worldcoin/minikit-react');
      
      if (!MiniKit.isInstalled()) {
        setError('Please open this app in World App to vote.');
        setIsLoading(false);
        return;
      }

      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.verify({
        action: actionId,
        signal: poll.id,
        verification_level: 'device',
      });

      if (finalPayload.status === 'error') {
        setError(finalPayload.error_code || 'Verification failed');
        setIsLoading(false);
        return;
      }

      // Submit vote with proof
      await handleVote(finalPayload);

    } catch (err) {
      console.error('Verification error:', err);
      setError('Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVote = async (proof: any) => {
    if (selectedOption === null) return;

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: poll.id,
          optionIdx: selectedOption,
          proof,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred.');
      }
      
      const pollResults: PollWithResults = {
        ...poll,
        counts: data.totalsPerOption.map((count: number, index: number) => ({ option_idx: index, count })),
        total_votes: data.totalVotes,
      };
      setResults(pollResults);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pollResultsData = useMemo(() => {
    if (!results) return null;
    const totalVotes = results.total_votes;
    return results.options.map((option, index) => {
      const voteInfo = results.counts.find(c => c.option_idx === index);
      const count = voteInfo ? voteInfo.count : 0;
      const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
      return { label: option, percentage, count };
    });
  }, [results]);

  if (results && pollResultsData) {
    return (
      <div className="bg-brand-gray-900 rounded-lg p-6 shadow-lg w-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">{results.question}</h2>
        <div className="space-y-3">
          {pollResultsData.map((res, index) => (
            <div key={index}>
              <ProgressBar percent={res.percentage} label={res.label} />
              <p className="text-xs text-brand-gray-400 text-right mt-1">{res.count.toLocaleString()} votes</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-6 text-brand-gray-300 font-medium">Total Votes: {results.total_votes.toLocaleString()}</p>
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
            className={`w-full p-4 rounded-lg text-left font-medium transition-all duration-200 border-2 ${
              selectedOption === index
                ? 'bg-blue-500 border-blue-400 text-white'
                : 'bg-brand-gray-800 border-brand-gray-700 hover:border-blue-500'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      <button
        onClick={handleVerifyClick}
        disabled={selectedOption === null || isLoading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-brand-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {isLoading ? 'Verifying...' : 'Verify & Cast Vote'}
      </button>
    </div>
  );
}