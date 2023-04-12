select opportunity_owner_id as "userId",
    attainment as "metricValue"
From (
        SELECT round(
                ((SUM(O.amount) / Q.quota)::NUMERIC * 100),
                -1
            ) RangeNo,
            (SUM(O.amount) / Q.quota)::NUMERIC * 100 as attainment,
            opportunity_owner_id
        FROM pl."Opportunity" O,
            (
                select Q.quota_owner_id,
                    sum(Q.amount) quota
                from pl."Quota" Q
                where Q.tenant_id = $3
                    AND Q.target_date >= $1
                    AND Q.target_date <= $2
                group by Q.quota_owner_id
            ) Q
        WHERE O.opportunity_owner_id = Q.quota_owner_id
            AND O.closed_date >= $1
            AND O.closed_date <= $2
            AND O.tenant_id = $3
            AND O.opportunity_stage = 'closed_won'
            AND O.OPPORTUNITY_OWNER_ID IN (
                WITH RECURSIVE SUBORDINATES AS (
                    SELECT USER_ID
                    FROM PL."User"
                    WHERE USER_ID = $4
                        AND TENANT_ID = $3
                    UNION
                    SELECT U.USER_ID
                    FROM PL."User" U
                        INNER JOIN SUBORDINATES S ON S.USER_ID = U.PARENT_ID
                        AND U.TENANT_ID = $3
                )
                SELECT USER_ID
                FROM SUBORDINATES
            )
        GROUP BY O.opportunity_owner_id,
            Q.quota
    ) temp
WHERE RangeNo = $5