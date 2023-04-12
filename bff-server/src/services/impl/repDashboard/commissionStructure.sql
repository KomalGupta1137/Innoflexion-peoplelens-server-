select 
tiered_commission_rate as "rate", threshold , threshold* (tiered_commission_rate/100) as "value"
from pl."CommissionPlans"
where persona='AE'
and tenant_id = $1
and tiered_commission_rate != '0.0'
