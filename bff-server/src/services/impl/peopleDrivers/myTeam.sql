select user_id as "userId"
from "pl"."User"
where parent_id = $1
  AND tenant_id = $2;
