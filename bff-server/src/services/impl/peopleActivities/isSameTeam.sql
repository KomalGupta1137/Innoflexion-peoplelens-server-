with recursive subhierarchies as (
  select user_id, array[user_id]::varchar[] as path
    from "User"
   where parent_id is null
  union all
  select c.user_id, p.path||c.user_id as path
    from subhierarchies p
         join "User" c on c.parent_id = p.user_id
)
select d.user_ids, count(s.path) > 0 as same_team
  from (values ($1)) as d(user_ids)
       left join subhierarchies s
         on s.path::text[] @> d.user_ids::text[]
 group by d.user_ids;