select * from 
(select account_name as "customer", concat(U.first_name,' ',U.last_name,',', 'VP Sales') as "decisionMaker", O.amount as "amount", closed_date as "closedDate", opportunity_stage as "status", 'Existing' as "relationship"
FROM pl."Opportunity" O,
     pl."QuoteLineItem" QL,
     pl."Quote" Q,
     pl."Account" A,
     pl."User" U
WHERE O.opportunity_id = Q.opportunity_id
  AND Q.quote_id = QL.quote_id
  AND A.account_id = O.account_id
  and A.account_owner_id = U.user_id
  AND O.opportunity_stage in ('proposal', 'decision')
  AND O.closed_date >= $1
  AND O.closed_date <=  $2
  AND O.tenant_id = $3
  AND EXISTS (select null from pl."Opportunity" old 
                                                where old.closed_date >= $5
                                                AND old.closed_date <= $6
                                                AND old.tenant_id = O.tenant_id
			 AND old.account_id = O.account_id)
  AND opportunity_owner_id IN (
    WITH RECURSIVE subordinates AS (
        SELECT user_id
        FROM pl."User"
        WHERE user_id = $4
          AND tenant_id = $3
        UNION
        SELECT u.user_id
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $3
    )
    SELECT user_id
    FROM subordinates) UNION 
	select account_name as "customer", concat(U.first_name, ' ',U.last_name, ',', 'VP Sales') as "decisionMaker", O.amount as "amount", closed_date as "closedDate", opportunity_stage as "status", 'New' as "relationship"
FROM pl."Opportunity" O,
     pl."QuoteLineItem" QL,
     pl."Quote" Q,
      pl."Account" A,
     pl."User" U
WHERE O.opportunity_id = Q.opportunity_id
  AND Q.quote_id = QL.quote_id
  AND A.account_id = O.account_id
  and A.account_owner_id = U.user_id
  AND O.opportunity_stage in ('proposal', 'decision')
  AND O.closed_date >= $1
  AND O.closed_date <= $2
  AND O.tenant_id = $3
  AND NOT EXISTS (select null from pl."Opportunity" old 
                                                where old.closed_date >= $5
                                                AND old.closed_date <= $6
                                                AND old.tenant_id = O.tenant_id
			 AND old.account_id = O.account_id)
  AND opportunity_owner_id IN (
    WITH RECURSIVE subordinates AS (
        SELECT user_id
        FROM pl."User"
        WHERE user_id = $4
          AND tenant_id = $3
        UNION
        SELECT u.user_id
        FROM pl."User" u
                 INNER JOIN subordinates s ON s.user_id = u.parent_id
            AND u.tenant_id = $3
    )
    SELECT user_id
    FROM subordinates)) temp order by 2 desc limit 5