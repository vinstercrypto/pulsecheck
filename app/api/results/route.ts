import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7');

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // For testing, be more inclusive with the date range
  const testMode = process.env.TEST_MODE === 'true';
  const query = supabase
    .from('poll_results')
    .select('*')
    .in('status', ['live', 'closed'])
    .gt('total_votes', 0);

  // In test mode, ignore date restrictions completely
  // In production, filter by start_ts within the last N days OR polls that are currently live
  if (!testMode) {
    // Show polls that started within the last N days OR are currently live
    query.or(`start_ts.gte.${cutoffDate.toISOString()},and(status.eq.live,start_ts.lte.${new Date().toISOString()},end_ts.gte.${new Date().toISOString()})`);
  }

  const { data, error } = await query.order('start_ts', { ascending: false });

  if (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }

  // Parse the options JSON string into an array and map poll_id to id
  const parsedData = data?.map(poll => ({
    ...poll,
    id: poll.poll_id, // Map poll_id to id for frontend compatibility
    options: typeof poll.options === 'string' ? JSON.parse(poll.options) : poll.options
  })) || [];

  console.log('Results API - Test mode:', testMode);
  console.log('Results API - Cutoff date:', cutoffDate.toISOString());
  console.log('Results API - Current date:', new Date().toISOString());
  console.log('Results API - Raw data count:', data?.length || 0);
  console.log('Results API - Raw data:', JSON.stringify(data, null, 2));
  console.log('Results API - Parsed data count:', parsedData.length);
  if (parsedData.length > 0) {
    console.log('Results API - First poll sample:', JSON.stringify(parsedData[0], null, 2));
  } else {
    console.log('Results API - No polls found. Check if polls exist with votes.');
  }

  return NextResponse.json(parsedData);
}