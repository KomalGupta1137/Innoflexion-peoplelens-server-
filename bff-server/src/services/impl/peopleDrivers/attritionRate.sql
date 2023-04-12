SELECT count(*) FILTER (where termination_date >= $1 AND termination_date <= $2) as "termedUsersInCurrentMonth",
       count(*) FILTER (where hire_date <= $2 AND termination_date IS NULL)      as "activeUsersInCurrentMonth",
       count(*) FILTER (where termination_date >= $3 AND termination_date <= $4) as "termedUsersInPreviousMonth",
       count(*) FILTER (where hire_date <= $4 AND termination_date IS NULL)      as "activeUsersInPreviousMonth"
FROM pl."User"
where tenant_id = $5
  AND user_id IN (
    WITH RECURSIVE subordinates AS (
        SELECT user_id
        FROM pl."User"
        WHERE user_id = $6
          AND tenant_id = $5
        UNION
        SELECT u.user_id
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $5
    )
    SELECT user_id
    FROM subordinates)

