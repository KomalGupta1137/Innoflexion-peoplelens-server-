SELECT SUM(amount) as "totalSalesForecast"
FROM "pl"."Quota"
WHERE target_date >= $1
  AND target_date <= $2
  AND tenant_id = $3
  AND quota_owner_id IN (
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

