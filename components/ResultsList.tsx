'use client';
import { PollWithResults } from "@/lib/types";
import { useMemo } from "react";

const ResultProgressBar = ({ percent, label }: { percent: number; label: string }) => (
    <div className="w-full bg-brand-gray-700 rounded-full h-6 flex items-center relative overflow-hidden">
      <div
        className="bg-blue-600 h-6 rounded-full"
        style={{ width: `${percent}%` }}
      ></div>
      <span className="absolute left-3 right-3 flex justify-between items-center text-xs font-medium text-white">
        <span>{label}</span>
        <span>{percent.toFixed(1)}%</span>
      </span>
    </div>
  );
  

// Fix: Changed component from a function declaration to a const arrow function.
// This helps TypeScript correctly identify it as a React component and allows the `key` prop.
const PollResultCard = ({ poll }: { poll: PollWithResults }) => {
    const pollResultsData = useMemo(() => {
      const totalVotes = poll.total_votes;
      return poll.options.map((option, index) => {
        const voteInfo = poll.counts.find(c => c.option_idx === index);
        const count = voteInfo ? voteInfo.count : 0;
        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
        return { label: option, percentage, count };
      });
    }, [poll]);
  
    return (
      <div className="bg-brand-gray-900 rounded-lg p-5 shadow-lg w-full">
        <p className="text-sm text-brand-gray-400 mb-2">
          {new Date(poll.start_ts).toLocaleDateString()}
        </p>
        <h3 className="text-lg font-semibold mb-4 text-white">{poll.question}</h3>
        <div className="space-y-4">
          {pollResultsData.map((res, index) => (
            <div key={index}>
              <ResultProgressBar percent={res.percentage} label={res.label} />
            </div>
          ))}
        </div>
        <p className="text-right mt-4 text-sm text-brand-gray-300 font-medium">Total Votes: {poll.total_votes.toLocaleString()}</p>
      </div>
    );
  }
  
export default function ResultsList({ polls }: { polls: PollWithResults[] }) {
    return (
        <div className="space-y-6">
            {polls.map((poll) => (
                <PollResultCard key={poll.id} poll={poll} />
            ))}
        </div>
    );
}