select 
tiered_commission_rate as "rate", threshold 
from pl."CommissionPlans"
where persona='AE'
and tenant_id = $1
order by 2 desc