select
    opportunity_owner_id as "userId",
    totSalesCycle as "metricValue"
From
    (
        select
            round(
                (
                    (
                        (newSalesCycle :: NUMERIC) / (max(newSalesCycle) over()) :: NUMERIC
                    ) * 100
                ),
                -1
            ) RangeNo,
            totSalesCycle,
            opportunity_owner_id
        from
            (
                select
                    (globalMax - totSalesCycle) as newSalesCycle,
                    totSalesCycle,
                    opportunity_owner_id
                from
                    (
                        select
                            max(totSalesCycle) over() globalMax,
                            min(totSalesCycle) over() globalMin,
                            totSalesCycle,
                            opportunity_owner_id
                        from
                            (
                                select
                                    avg(salesCycle) as totSalesCycle,
                                    opportunity_owner_id
                                from
                                    (
                                        select
                                            extract(
                                                day
                                                from
                                                    (closed_date - created_date)
                                            ) as salesCycle,
                                            opportunity_owner_id
                                        from
                                            pl. "Opportunity"
                                        WHERE
                                            closed_date >= $1
                                            AND closed_date <= $2
                                            AND opportunity_stage = 'closed_won'
                                            AND tenant_id = $3
                                            AND OPPORTUNITY_OWNER_ID IN (
                                                WITH RECURSIVE SUBORDINATES AS (
                                                    SELECT
                                                        USER_ID
                                                    FROM
                                                        PL. "User"
                                                    WHERE
                                                        USER_ID = $4
                                                        AND TENANT_ID = $3
                                                    UNION
                                                    SELECT
                                                        U.USER_ID
                                                    FROM
                                                        PL. "User" U
                                                        INNER JOIN SUBORDINATES S ON S.USER_ID = U.PARENT_ID
                                                        AND U.TENANT_ID = $3
                                                )
                                                SELECT
                                                    USER_ID
                                                FROM
                                                    SUBORDINATES
                                            )
                                    ) tmp1
                                group by
                                    opportunity_owner_id
                            ) tmp
                    ) temp
            ) temp1
    ) t
WHERE
    RangeNo = $5