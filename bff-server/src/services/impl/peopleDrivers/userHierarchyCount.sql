WITH RECURSIVE subordinates AS (
    SELECT user_id, persona
    FROM pl."User"
    WHERE user_id = $1
      AND tenant_id = $2
    UNION
    SELECT u.user_id, u.persona
    FROM pl."User" u
             INNER JOIN subordinates s ON s.user_id = u.parent_id
        AND u.tenant_id = $2
)

select persona, count(*) from subordinates group by persona;