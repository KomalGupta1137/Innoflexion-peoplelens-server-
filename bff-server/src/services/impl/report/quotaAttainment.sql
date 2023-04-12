SELECT AVG(attainment) * 100 as "avgQuotaAttainment", MAX(attainment) * 100 as "maxQuotaAttainment"
FROM (
    SELECT (SUM(O.amount) / Q.quota)::NUMERIC as attainment
    FROM pl."Opportunity" O,
      (
        select Q.quota_owner_id,
          sum(Q.amount) quota
        from pl."Quota" Q
        where Q.tenant_id = $3
          AND Q.target_date >= $1
          AND Q.target_date <= $2
        group by Q.quota_owner_id
      ) Q
    WHERE O.opportunity_owner_id = Q.quota_owner_id
      AND O.closed_date >= $1
      AND O.closed_date <= $2
      AND O.tenant_id = $3
      AND O.opportunity_stage = 'closed_won'
    GROUP BY O.opportunity_owner_id,
      Q.quota
  ) as average