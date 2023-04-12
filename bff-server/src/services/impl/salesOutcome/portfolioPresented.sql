SELECT(
              (
                  SELECT COUNT(DISTINCT product_id)
                  FROM pl."Opportunity" O,
                       pl."Quote" Q,
                       pl."QuoteLineItem" QL
                  WHERE QL.quote_id = Q.quote_id
                    AND Q.opportunity_id = O.opportunity_id
                    AND O.closed_date >= $1
                    AND O.closed_date <= $2
                    AND O.tenant_id = $3
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
                      FROM subordinates)
              )::NUMERIC
              /
              (
                  SELECT COUNT(DISTINCT product_id)
                  FROM pl."Product"
                  WHERE tenant_id = $3
              )::NUMERIC
          ) * 100 as "portfolioPresented"
