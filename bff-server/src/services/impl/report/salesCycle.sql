SELECT avg(salesCycle) as "avgSalesCycle",
  max(salesCycle) as "maxSalesCycle"
From (
    select extract(
        day
        from (closed_date - created_date)
      ) as salesCycle,
      O.opportunity_id
    from pl."Opportunity" O
    where O.closed_date >= $1
      AND O.closed_date <= $2
      AND O.tenant_id = $3
  ) opp