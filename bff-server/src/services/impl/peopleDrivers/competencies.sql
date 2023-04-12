select comp.competency,avg(score) as  "score",avg(mgr_score) as "mgrScore" from pl."Competency" comp, pl."CompetencyScore" sc
where comp.competency_id=sc.competency_id  
 and sc.user_id in (WITH RECURSIVE subordinates AS (
        SELECT user_id
        FROM pl."User"
        WHERE user_id = $1
          AND tenant_id = $2
        UNION
        SELECT u.user_id
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $2
    )
	SELECT user_id
    FROM subordinates) group By comp.competency
