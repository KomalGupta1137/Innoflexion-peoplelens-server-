select
        case
                when count(distinct opp.opportunity_owner_id) = 0 then 0
                else (
                        count(distinct acc.account_id) / count(distinct opp.opportunity_owner_id)
                )
        end as coverage
from
        pl. "Account" acc
        inner join pl. "Opportunity" opp on opp.account_id = acc.account_id
        inner join pl. "Activity" act ON act.opportunity_id = opp.opportunity_id
where
        act.activity_date >= $1
        and act.activity_date <= $2
        and opp.opportunity_owner_id in (
                WITH RECURSIVE SUBORDINATES AS (
                        SELECT
                                USER_ID
                        FROM
                                PL. "User"
                        WHERE
                                USER_ID = $3
                                and tenant_id = $4
                        UNION
                        SELECT
                                U.USER_ID
                        FROM
                                PL. "User" U
                                INNER JOIN SUBORDINATES S ON S.USER_ID = U.PARENT_ID
                                and tenant_id = $4
                )
                SELECT
                        USER_ID
                FROM
                        SUBORDINATES
        )