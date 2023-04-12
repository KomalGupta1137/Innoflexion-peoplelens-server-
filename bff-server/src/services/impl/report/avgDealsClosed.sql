select count( O.opportunity_id)/count(distinct O.opportunity_owner_id) as "avgDealsClosed"
FROM pl."Opportunity" O
where O.opportunity_stage = 'closed_won'
AND O.closed_date >= $1
  AND O.closed_date <= $2
  AND O.tenant_id = $3