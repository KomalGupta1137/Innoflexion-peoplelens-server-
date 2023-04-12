select
    N. "userId",
    N.action,
    N. "actionCompleteDate",
    N. "createdDate",
    concat(U.first_name, ' ', U.last_name) as "managerName",
    U.email
from
    "Notification" N,
    pl. "User" U
where
    N. "tenantId" = $1
    AND N. "userId" = $2
    AND N. "parentId" = U.user_id
    AND id = $3;