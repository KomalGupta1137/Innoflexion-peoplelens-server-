select 
case when score >= 4 then 'high' 
when score >= 2 and score < 4 then 'medium'
when  score < 2 then 'low' end scores, 
participant_id, product_id
from (select 
participant_id, C.product_id, avg(post_course_assesment_score) as score
from pl."CourseParticipation" CP,
pl."Course" C,
	  pl."Product" P
where CP.course_id = C.course_id 
	  and C.product_id = P.product_id
and CP.assigned_date is not null
and CP.start_date is not null
and CP.completion_date is not null
and CP.tenant_id = $3
  AND CP.assigned_date >= $1
  AND CP.assigned_date <= $2
and CP.participant_id in (
    WITH RECURSIVE subordinates AS (
        SELECT user_id
        FROM pl."User"
        WHERE user_id = $4
          AND tenant_id = $3
        UNION
        SELECT u.user_id
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $3
    )
    SELECT user_id
    FROM subordinates) group by C.product_id, participant_id) as tempp;

