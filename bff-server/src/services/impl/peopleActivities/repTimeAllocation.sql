select attendee, M.meeting_guid, u.user_id, extract(epoch FROM (M.dtend - M.dtstart)) / 3600 as duration
from meeting_attendee MA
         inner join meeting_prd M on MA.meeting_guid = M.meeting_guid left join "User" U on u.email =  attendee
where M.meeting_guid IN (select M.meeting_guid
                         from meeting_attendee MA
                                  join meeting_prd M on MA.meeting_guid = M.meeting_guid
                         where MA.attendee = 'lseneschal0@upenn.edu'
                           AND M.dtstart >= $1
                           AND M.dtend <= $2)
group by M.dtend, M.meeting_guid, attendee, M.dtstart, u.user_id;