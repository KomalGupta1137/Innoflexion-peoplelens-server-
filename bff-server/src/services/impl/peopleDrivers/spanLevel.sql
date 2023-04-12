WITH RECURSIVE cte AS (
    SELECT 1 AS lvl, parent_id, user_id, termination_date
    FROM pl."User" as U
    WHERE parent_id IS NULL
        AND user_id = $1
        AND tenant_id = $2
    UNION ALL
    SELECT lvl + 1, U.parent_id, U.user_id, U.termination_date
    FROM pl."User" as U
             JOIN cte
                  ON U.parent_id = cte.user_id
)
select cast(avg(span) as int) as span, max(lvl) as level
from (
         select parent_id, lvl, count(*) as span
         from cte
         WHERE termination_date is null
               or termination_date <= $3
         group by parent_id, lvl
         order by count(*) desc, lvl) as temp;

