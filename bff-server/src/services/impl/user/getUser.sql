select first_name as "firstName", last_name as "lastName", user_id as "userId", persona,email, designation, tenant_id as "tenantId"
from pl."User"
WHERE tenant_id = $1 and
user_id = $2;