import { supabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Check admin token
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (!expectedToken) {
    return NextResponse.json({ error: 'Admin token not configured' }, { status: 500 });
  }
  
  if (adminToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date().toISOString();

  try {
    // Close polls that have ended
    const { error: closeError } = await supabase
      .from('poll')
      .update({ status: 'closed' })
      .eq('status', 'live')
      .lt('end_ts', now);

    if (closeError) {
      console.error('Error closing polls:', closeError);
      return NextResponse.json({ error: 'Failed to close polls' }, { status: 500 });
    }

    // Activate polls that should be live now
    const { error: activateError } = await supabase
      .from('poll')
      .update({ status: 'live' })
      .eq('status', 'scheduled')
      .lte('start_ts', now)
      .gte('end_ts', now);

    if (activateError) {
      console.error('Error activating polls:', activateError);
      return NextResponse.json({ error: 'Failed to activate polls' }, { status: 500 });
    }

    // Get current status counts
    const { data: statusCounts } = await supabase
      .from('poll')
      .select('status');

    const counts = statusCounts?.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      message: 'Polls advanced successfully',
      counts: {
        scheduled: counts.scheduled || 0,
        live: counts.live || 0,
        closed: counts.closed || 0
      }
    });

  } catch (error) {
    console.error('Error advancing polls:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
