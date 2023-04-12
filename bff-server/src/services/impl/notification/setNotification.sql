insert into pl."Notification" ("tenantId", "userId", "parentId", "action", "actionCompleteDate", "rec_id")
values ($1, $2, $3, $4, $5, $6) RETURNING "id";