select max(WinRate) * 100 as "maxWinRate",
    avg(WinRate) * 100 as "avgWinRate"
from (
        SELECT opportunity_owner_id,
            COUNT(*) FILTER (
                WHERE opportunity_stage = 'closed_won'
            ) / NULLIF(
                COUNT(*) Filter (
                    where opportunity_stage IN ('closed_won', 'closed_lost')
                ),
                0
            ) as WinRate
        FROM pl."Opportunity"
        WHERE closed_date >= $1
            AND closed_date <= $2
            ANd tenant_id = $3
        group by opportunity_owner_id
    ) as winRateData