select N."userId", N.action, N."actionCompleteDate", N."createdDate", N."doneDate", U.first_name as "managerName" from "Notification" N, pl."User" U 
where N."tenantId" = $1 AND N."userId" = $2 AND N."parentId" = U.user_id  order by "createdDate";