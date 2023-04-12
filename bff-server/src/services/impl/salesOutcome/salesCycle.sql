SELECT  Prod.product_id as "productId" , avg(salesCycle)  as "productCycle"
    From pl."Quote" Q,
    pl."QuoteLineItem" QL,
    pl."Product" Prod,
	(select extract( day from (closed_date - created_date)) as salesCycle, O.opportunity_id
    from pl."Opportunity" O
	where  O.closed_date >= $1
  AND O.closed_date <= $2
  AND O.tenant_id = $3  
   AND  opportunity_owner_id IN (
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
    FROM subordinates)

	) opp
	WHERE opp.opportunity_id = Q.opportunity_id
  AND Q.quote_id = QL.quote_id
  AND QL.product_id = Prod.product_id
  GROUP BY Prod.product_id
  order by "productCycle" asc