select
    opportunity_owner_id as "userId",
    dealsize as "metricValue"
From
    (
        select
            round(
                (
                    (
                        (dealsizeval :: NUMERIC) / (max(dealsizeval) over()) :: NUMERIC
                    ) * 100
                ),
                -1
            ) RangeNo,
            dealsizeval as dealsize,
            opportunity_owner_id
        from
            (
                select
                    case
                        when noofdeals = 0 then 0
                        else (totsales :: NUMERIC / noofdeals :: NUMERIC)
                    end as "dealsizeval",
                    opportunity_owner_id
                from
                    (
                        SELECT
                            COUNT(*) noofdeals,
                            sum(amount) as totsales,
                            opportunity_owner_id
                        FROM
                            pl. "Opportunity"
                        WHERE
                            closed_date >= $1
                            AND closed_date <= $2
                            AND tenant_id = $3
                            AND opportunity_stage = 'closed_won'
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
                        GROUP BY
                            opportunity_owner_id
                    ) temp
            ) tmp
    ) t
WHERE
    RangeNo = $5