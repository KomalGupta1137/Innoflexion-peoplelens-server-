SELECT
  activity_type,
  COUNT(*) as activity_count
FROM
  pl. "Activity" Atv
WHERE
  Atv.activity_date >= $1
  AND Atv.activity_date <= $2
  AND Atv.activity_owner_id IN (
    select
      user_id
    from
      (
        WITH RECURSIVE subordinates AS (
          SELECT
            user_id,
            persona
          FROM
            pl. "User"
          WHERE
            user_id = $3
            AND tenant_id = $4
          UNION
          SELECT
            u.user_id,
            u.persona
          FROM
            pl. "User" u
            INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $4
        )
        SELECT
          user_id,
          persona
        FROM
          subordinates
      ) temp
    where
      persona = 'AE'
  )
GROUP BY
  activity_type