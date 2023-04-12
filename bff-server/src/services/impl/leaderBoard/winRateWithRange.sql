select opportunity_owner_id as "userId",
    winrate as "metricValue"
From (
        select round(
                (
                    (closed::NUMERIC / NULLIF(total::NUMERIC, 0)) * 100
                ),
                -1
            ) RangeNo,
            (closed::NUMERIC / NULLIF(total::NUMERIC, 0)) * 100 as "winrate",
            opportunity_owner_id
        from (
                SELECT COUNT(*) FILTER (
                        where opportunity_stage IN ('closed_won', 'closed_lost')
                    ) as total,
                    count(*) FILTER (
                        where opportunity_stage = 'closed_won'
                    ) as closed,
                    opportunity_owner_id
                FROM pl."Opportunity"
                WHERE closed_date >= $1
                    AND closed_date <= $2
                    AND tenant_id = $3
                    AND OPPORTUNITY_OWNER_ID IN (
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
                GROUP BY opportunity_owner_id
            ) temp
    ) tmp
WHERE RangeNo = $5