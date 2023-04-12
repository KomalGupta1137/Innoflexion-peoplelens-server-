select
    "product_id" as id,
    "product_name" as name
from
    pl. "Product"
where
    tenant_id = $1
order by
    name asc;