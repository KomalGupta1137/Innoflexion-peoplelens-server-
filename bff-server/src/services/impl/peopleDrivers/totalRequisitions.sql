select count(*) as "totalReqs"
from pl."Requisition"
where requisition_created_date <= $3
    and tenant_id = $1
    and requisition_closed_date is null
    and requisition_owner_id IN (
        WITH RECURSIVE subordinates AS (
            SELECT user_id
            FROM pl."User"
            WHERE user_id = $2
                AND tenant_id = $1
            UNION
            SELECT u.user_id
            FROM pl."User" u
                INNER JOIN subordinates s ON s.user_id = u.parent_id
                AND u.tenant_id = $1
        )
        SELECT user_id
        FROM subordinates
    )