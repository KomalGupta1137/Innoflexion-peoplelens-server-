select count(case when gender = 'male' then 1 end)   as "noOfMale",
       count(case when gender = 'female' then 1 end) as "noOfFemale",
       count(*)                                      as "total"
from pl."User"
where termination_date is null
   or termination_date <= $1
    and tenant_id = $2;
