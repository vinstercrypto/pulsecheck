-- Fix poll_results view to remove SECURITY DEFINER and improve RLS compatibility
DROP VIEW IF EXISTS poll_results;

CREATE VIEW poll_results AS
SELECT 
  p.id as poll_id,
  p.question,
  p.options,
  p.status,
  p.start_ts,
  p.end_ts,
  COUNT(v.id) as total_votes,
  COALESCE(
    JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'option_idx', v.option_idx,
        'count', COUNT(*)
      )
    ) FILTER (WHERE v.id IS NOT NULL),
    '[]'::jsonb
  ) as counts
FROM poll p
LEFT JOIN vote v ON p.id = v.poll_id
GROUP BY p.id, p.question, p.options, p.status, p.start_ts, p.end_ts;

-- Ensure the view is accessible without SECURITY DEFINER issues
GRANT SELECT ON poll_results TO anon;
GRANT SELECT ON poll_results TO authenticated;
