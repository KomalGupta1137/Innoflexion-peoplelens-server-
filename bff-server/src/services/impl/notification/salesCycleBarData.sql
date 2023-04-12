SELECT  Prod.product_id as "productId" , avg(salesCycle)  as "productCycle"
    From pl."Quote" Q,
    pl."QuoteLineItem" QL,
    pl."Product" Prod,
	(select extract( day from (closed_date - created_date)) as salesCycle, O.opportunity_id
    from pl."Opportunity" O
	where  O.closed_date >= $3
  AND O.closed_date <= $4
  AND O.tenant_id = $1  
   AND  opportunity_owner_id = $2

	) opp
	WHERE opp.opportunity_id = Q.opportunity_id
  AND Q.quote_id = QL.quote_id
  AND QL.product_id = Prod.product_id
  GROUP BY Prod.product_id
  order by "productCycle" asc