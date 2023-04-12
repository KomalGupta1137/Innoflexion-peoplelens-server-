select comp.base_pay as "base",
comp.vested_equity * comp.share_price as "vestedEquity",
 sales.salesClosed as "totalSalesClosed"
from 
pl."Compensation" comp, 
(SELECT SUM(amount) salesClosed, opportunity_owner_id
FROM "pl"."Opportunity"
WHERE closed_date >= $1
  AND closed_date <= $2
  AND tenant_id = $3 
 AND opportunity_owner_id = $4
  AND opportunity_stage = 'closed_won'
  group by opportunity_owner_id) as sales
where opportunity_owner_id = comp.user_id