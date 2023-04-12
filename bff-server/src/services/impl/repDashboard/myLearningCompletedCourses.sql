select
    course_name as "course",
    post_course_assesment_score as "assessmentScore",
    completion_date as "courseDate"
from
    pl. "CourseParticipation" CP,
    pl. "Course" C
where
    C .course_id = CP.course_id
    and participant_id = $4
    and completion_date is not null
    and CP.tenant_id = $3
    and completion_date >= $1
    and completion_date <= $2
order by
    3 asc
limit
    2