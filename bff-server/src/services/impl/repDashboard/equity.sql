select vested_equity as "vestedShares", total_equity-vested_equity as "remainingShares",
      vested_equity * share_price as "vestedAmount", (total_equity-vested_equity) * share_price as "remainingAmount"
from pl."Compensation"
where 
 tenant_id = $1 and
   user_id = $2
  
   and grant_date <= $3

