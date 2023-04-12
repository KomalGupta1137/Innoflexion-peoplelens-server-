select 
count(distinct participant_id) filter(where assigned_date is not null and start_date is null) as not_started,
count(distinct participant_id) filter(where assigned_date is not null and start_date is not null and completion_date is null) as in_progress,
count(distinct participant_id) filter(where start_date is not null and completion_date is not null) as completed
from pl."CourseParticipation" CP,
pl."Course" C 
where CP.course_id = C.course_id 
and CP.tenant_id = $3
  AND CP.assigned_date >= $1
  AND CP.assigned_date <= $2
  and C.product_id = $5
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

