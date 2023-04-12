select
    concat(account_name, ': ', subject) as subject,
    activity_date as date,
    status
from
    "SFMeetings"
where
    -- owner_id = $1 and
    activity_date >= $1
    AND activity_date <= $2
order by
    activity_date;