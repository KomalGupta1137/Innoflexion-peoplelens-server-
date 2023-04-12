select
	(
		nullif(sum(followup), 0) / nullif(sum(initial), 0)
	) * 100 AS fur
from
	(
		SELECT
			act.activity_owner_id as user_id,
			COUNT(
				case
					when activity_type = 'customer_meeting_discovery' then 1
				end
			) as "initial",
			COUNT(
				case
					when activity_type = 'customer_meeting_demo'
					or activity_type = 'customer_meeting_decisionmaker' then 1
				end
			) as "followup"
		from
			pl. "Account" acc
			inner join pl. "Opportunity" opp on opp.account_id = acc.account_id
			inner join pl. "Activity" act ON act.opportunity_id = opp.opportunity_id
		where
			act.activity_date >= $1
			and act.activity_date <= $2
			and act.activity_owner_id in (
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
		GROUP BY
			act.activity_owner_id
	) tmp