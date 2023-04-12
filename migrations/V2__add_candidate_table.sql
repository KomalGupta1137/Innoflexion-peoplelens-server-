DROP TABLE "pl"."Requisition";
CREATE TABLE "pl"."Requisition"
(
    "tenant_id"                char(36),
    "requisition_id"           char(36) PRIMARY KEY,
    "worker_id"                char(36),
    "requisition_owner_id"     char(36),
    "requisition_stage"        "pl"."RequisitionStage",
    "requisition_date"         timestamp with time zone,
    "requisition_created_date" timestamp with time zone,
    "requisition_closed_date"  timestamp with time zone
);
CREATE TABLE "pl"."Candidate"
(
    "tenant_id"         char(36),
    "candidate_id"      char(36),
    "requisition_id"    char(36),
    "requisition_stage" "pl"."RequisitionStage",
    "last_updated_at"   timestamp with time zone,
    PRIMARY KEY ("candidate_id", "requisition_stage")
);
ALTER TABLE "pl"."Candidate"
    ADD FOREIGN KEY ("requisition_id") REFERENCES "pl"."Requisition" ("requisition_id");

ALTER TABLE "pl"."Activity"
    ADD COLUMN "activity_owner_id" char(36) REFERENCES "pl"."User" ("user_id");
