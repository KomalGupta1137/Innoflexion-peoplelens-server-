select COUNT(O.opportunity_id) AS "noOfDeals"
FROM pl."Opportunity" O,
     pl."QuoteLineItem" QL,
     pl."Quote" Q
WHERE O.opportunity_id = Q.opportunity_id
  AND Q.quote_id = QL.quote_id
  AND O.opportunity_stage = 'closed_won'
  AND O.closed_date >= $1
  AND O.closed_date <= $2
  AND O.tenant_id = $3
  AND opportunity_owner_id IN (
    WITH RECURSIVE subordinates AS (
        SELECT user_id
        FROM pl."User"
        WHERE user_id = $4
          AND tenant_id = $3
        UNION
        SELECT u.user_id
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $3
    )
    SELECT user_id
    FROM subordinates)
