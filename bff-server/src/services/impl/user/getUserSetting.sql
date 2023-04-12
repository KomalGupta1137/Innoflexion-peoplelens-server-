select U."first_name", U."last_name", U."email", U."designation",  US."notification", US."calendar", US."timeline", US."overview", US."leaderboard", US."reports",
US."people", US."customer"
from pl."User" as U left join pl."UserSetting" as US on U.user_id = US."userId"
where U.user_id = $1 limit 1