select EXTRACT(DAY FROM DATE_TRUNC('day', avg(timeToHire)))::int as "avgTimeToHire"
from (
         select max(u.hire_date) - max(req.requisition_created_date) timeToHire
         from pl."User" u,
              pl."Requisition" req
         where u.user_id = req.requisition_owner_id
           AND u.hire_date >= $1
           AND u.hire_date <= $2
           AND u.tenant_id = $3
           AND u.user_id IN (
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
         group by u.user_id) temp
