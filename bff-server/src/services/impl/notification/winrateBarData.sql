select (closed::NUMERIC / NULLIF(total::NUMERIC, 0)) * 100 as "winRate"
from (
    SELECT COUNT(*) FILTER (
        where opportunity_stage IN ('closed_won', 'closed_lost')
      ) as total,
      count(*) FILTER (
        where opportunity_stage = 'closed_won'
      ) as closed
    FROM pl."Opportunity"
    WHERE closed_date >= $3
      AND closed_date <= $4
      AND tenant_id = $1
      AND OPPORTUNITY_OWNER_ID  = $2
  ) temp