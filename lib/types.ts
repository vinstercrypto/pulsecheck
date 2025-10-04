
export interface Poll {
  id: string;
  question: string;
  options: string[];
  start_ts: string;
  end_ts: string;
  status: 'scheduled' | 'live' | 'closed';
}

export interface VoteCount {
  option_idx: number;
  count: number;
}

export interface PollWithResults extends Poll {
  counts: VoteCount[];
  total_votes: number;
}

export interface LivePollResponse {
  poll: Poll | null;
  starts_in_seconds?: number;
}
