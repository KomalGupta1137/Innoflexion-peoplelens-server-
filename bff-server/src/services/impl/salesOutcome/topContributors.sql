SELECT product_id as "productId", SUM(quoteLineItem.amount) as "totalAmount"
FROM pl."QuoteLineItem" quoteLineItem
         join pl."Quote" quote
              on quote.quote_id = quoteLineItem.quote_id
         join pl."Opportunity" opportunity
              on opportunity.opportunity_id = quote.opportunity_id
WHERE opportunity.closed_date >= $1
  AND opportunity.closed_date <= $2
  AND opportunity.tenant_id = $3
  AND opportunity.opportunity_stage = 'closed_won'
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
GROUP BY "productId"
ORDER BY "totalAmount" desc
