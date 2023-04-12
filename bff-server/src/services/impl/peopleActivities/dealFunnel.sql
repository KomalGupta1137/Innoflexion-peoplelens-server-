select count(case when opportunity_stage = 'prospecting' then 1 end) as "opps",
	count(case when opportunity_stage = 'decision' then 1 end) as "meetings",
	count(case when opportunity_stage = 'proposal' then 1 end) as "proposals",
	count(case when opportunity_stage = 'closed_won' then 1 end) as "deals",
count(case when opportunity_stage = 'negotiating' then 1 end) as "activenegotiations"
from pl."Opportunity" 
where closed_date >= $1
and closed_date <= $2
and opportunity_owner_id = $3
and tenant_id = $4;