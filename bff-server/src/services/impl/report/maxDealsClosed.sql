select count(*) as "maxDealsClosed"
FROM pl."Opportunity" O
where O.opportunity_stage = 'closed_won'
AND O.closed_date >= $1
  AND O.closed_date <= $2
  AND O.tenant_id = $3
group by O.opportunity_owner_id order by 1 desc limit 1