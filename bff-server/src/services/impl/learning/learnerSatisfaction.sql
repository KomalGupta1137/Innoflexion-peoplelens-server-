select 
count(distinct participant_id) filter(where satisfaction_score > 4) as high,
count(distinct participant_id) filter(where satisfaction_score > 2 and satisfaction_score < 4) as medium,
count(distinct participant_id) filter(where satisfaction_score < 2) as low
from pl."CourseParticipation" CP,
pl."Course" C 
where CP.course_id = C.course_id 
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
    FROM subordinates)