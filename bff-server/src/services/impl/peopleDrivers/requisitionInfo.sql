select requisition_stage as "requisitionStage",
  count(*) as "noOfCandidates"
from "pl"."Candidate" c
where exists (
    select null
    from pl."Requisition" r
    where r.tenant_id = c.tenant_id
      and (
        (
          r.requisition_owner_id is not null
          and (
            r.requisition_closed_date >= $3
            and r.requisition_closed_date <= $4
          )
        )
        OR (r.requisition_owner_id is null)
      )
      and c.requisition_id = r.requisition_id
      AND r.requisition_owner_id IN (
        WITH RECURSIVE subordinates AS (
          SELECT user_id
          FROM pl."User"
          WHERE user_id = $2
            AND tenant_id = $1
          UNION
          SELECT u.user_id
          FROM pl."User" u
            INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $1
        )
        SELECT user_id
        FROM subordinates
      )
  )
  and c.last_updated_at = (
    select max(last_updated_at)
    from "pl"."Candidate" c1
    where c.requisition_id = c1.requisition_id
  )
  and c.last_updated_at <= $4
  and c.tenant_id = $1
group By requisition_stage