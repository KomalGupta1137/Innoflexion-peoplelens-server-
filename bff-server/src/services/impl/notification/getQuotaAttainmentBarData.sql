SELECT AVG(attainment) * 100 as "quotaAttainment"
FROM (
    SELECT (SUM(O.amount) / Q.quota)::NUMERIC as attainment
    FROM pl."Opportunity" O,
      (
        select Q.quota_owner_id,
          sum(Q.amount) quota
        from pl."Quota" Q
        where Q.tenant_id = $1
          AND Q.target_date >= $3
          AND Q.target_date < $4
        group by Q.quota_owner_id
      ) Q
    WHERE O.opportunity_owner_id = Q.quota_owner_id
      AND O.closed_date >= $3
      AND O.closed_date < $4
      AND O.tenant_id = $1
      AND O.opportunity_stage = 'closed_won'
      AND opportunity_owner_id = $2
    GROUP BY O.opportunity_owner_id,
      Q.quota
  ) as average