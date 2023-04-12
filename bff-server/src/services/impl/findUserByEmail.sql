select first_name as "firstName", last_name as "lastName", user_id as "userId", persona, designation, tenant_id as "tenantId"
from pl."User"
WHERE email = $1;