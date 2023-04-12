SELECT AVG(pipeline_score)*(100/13) as pipelinescore FROM (
SELECT opportunity_id, COUNT(*) as pipeline_score FROM (
	SELECT Atv.opportunity_id, date_part('week', activity_date::date) AS weekly
	FROM pl."Activity" Atv
	WHERE 	Atv.activity_date >= $1
	AND 	Atv.activity_date <= $2
	AND Atv.activity_owner_id IN (
    select user_id from (
    WITH RECURSIVE subordinates AS (
        SELECT user_id, persona
        FROM pl."User"
        WHERE user_id = $3
          AND tenant_id = $4
        UNION
        SELECT u.user_id, u.persona
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $4 
    )
    SELECT user_id, persona
    FROM subordinates) temp where persona= ANY($5))
	GROUP BY Atv.opportunity_id, weekly
	) as week_count
GROUP BY opportunity_id
	) as score