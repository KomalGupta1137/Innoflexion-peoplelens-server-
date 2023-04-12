select course_name as "course", assigned_date as "courseDate", CP.* 
from pl."CourseParticipation" CP,
pl."Course" C
where C.course_id  = CP.course_id and participant_id = $4
and start_date is  null
and CP.tenant_id = $3
 and assigned_date >= $1
and assigned_date <= $2
order by 2 desc limit 2