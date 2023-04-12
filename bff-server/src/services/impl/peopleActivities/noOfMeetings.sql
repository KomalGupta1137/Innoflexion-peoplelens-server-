select count(*) from(
select opportunity_id from pl."Activity" 
where activity_type = 'customer_meeting_discovery'
and activity_date >= $1 and activity_date <= $2
and activity_owner_id = $3 
and tenant_id = $4
INTERSECT
select opportunity_id from pl."Activity" 
where activity_type = 'customer_meeting_demo'
and activity_date >= $1 and activity_date <= $2
and activity_owner_id = $3 
and tenant_id = $4
INTERSECT
select opportunity_id from pl."Activity" 
where activity_type = 'customer_meeting_decisionmaker'
and activity_date >= $1 and activity_date <= $2 
and activity_owner_id = $3 
and tenant_id = $4 ) opp;