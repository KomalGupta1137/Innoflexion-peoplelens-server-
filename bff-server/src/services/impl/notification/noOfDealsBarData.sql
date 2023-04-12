select COUNT(O.opportunity_id) AS "noOfDeals"
FROM pl."Opportunity" O,
     pl."QuoteLineItem" QL,
     pl."Quote" Q
WHERE O.opportunity_id = Q.opportunity_id
  AND Q.quote_id = QL.quote_id
  AND O.opportunity_stage = 'closed_won'
  AND O.closed_date >= $4
  AND O.closed_date <= $3
  AND O.tenant_id = $1
  AND opportunity_owner_id  = $2