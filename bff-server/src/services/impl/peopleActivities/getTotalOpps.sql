select
    avg(tmp.opps)
from
    (
        select
            opportunity_owner_id,
            count(opportunity_id) as opps
        from
            pl. "Opportunity"
        where
            created_date >= $1
            and created_date <= $2
            and opportunity_owner_id in (
                WITH RECURSIVE subordinates AS (
                    SELECT
                        user_id
                    FROM
                        pl. "User"
                    WHERE
                        user_id = $4
                        AND tenant_id = $3
                    UNION
                    SELECT
                        u.user_id
                    FROM
                        pl. "User" u
                        INNER JOIN subordinates s ON s.user_id = u.parent_id
                        AND u.tenant_id = $3
                )
                SELECT
                    user_id
                FROM
                    subordinates
            )
        group by
            opportunity_owner_id
    ) as tmp