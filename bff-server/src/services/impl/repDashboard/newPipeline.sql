select
    "Customer" as customer,
    "Relationship" as relationship,
    "Opportunity" as opportunity,
    "DecisionMaker" as "decisionMaker",
    "ClosingDate" as "closedDate",
    "Stage" as status,
    "MyNextStep" as "myNextStep"
from
    "Pipeline"
where
    "ClosingDate" >= $1
    and "ClosingDate" <= $2
order by
    "Pipeline"."Relationship";