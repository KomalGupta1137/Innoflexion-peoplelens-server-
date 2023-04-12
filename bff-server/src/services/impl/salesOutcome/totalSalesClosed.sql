SELECT SUM(amount) as "totalSalesClosed", SUM(amount) * 0.67 as "existingTotalSalesClosed"
FROM "pl"."Opportunity"
WHERE closed_date >= $1
  AND closed_date <= $2
  AND tenant_id = $3
  AND opportunity_stage = 'closed_won'
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
