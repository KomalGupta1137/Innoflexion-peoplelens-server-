SELECT 
avg(totalSalesClosed) as "avgSalesClosed",
   max(totalSalesClosed) as "maxSalesClosed"
 from ( select sum(amount) as totalSalesClosed
FROM  "pl"."Opportunity"

WHERE closed_date >= $1
  AND closed_date <= $2
  AND tenant_id = $3
  AND opportunity_stage = 'closed_won'
  group by opportunity_owner_id) temp;