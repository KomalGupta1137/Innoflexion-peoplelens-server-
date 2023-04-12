CREATE TYPE "pl"."Gender" AS ENUM (
    'male',
    'female',
    'unidentified'
    );

CREATE TYPE "pl"."OpportunityStage" AS ENUM (
    'prospecting',
    'decision',
    'proposal',
    'closed_won',
    'closed_lost'
    );

CREATE TYPE "pl"."RequisitionStage" AS ENUM (
    'filed',
    'hired',
    'rejected',
    'interviewing'
    );

CREATE TYPE "pl"."ActivityType" AS ENUM (
    'task',
    'email',
    'calls',
    'customer_meeting',
    'product_meeting',
    'internal_meeting',
    'unknown'
    );

CREATE TABLE "pl"."User"
(
    "tenant_id"        char(36),
    "user_id"          char(36) PRIMARY KEY,
    "parent_id"        char(36),
    "hire_date"        timestamp with time zone,
    "gender"           "pl"."Gender",
    "termination_date" timestamp with time zone
);

CREATE TABLE "pl"."pl"."Account"
(
    "tenant_id"        char(36),
    "account_id"       char(36) PRIMARY KEY,
    "account_owner_id" char(36)
);

CREATE TABLE "pl"."pl"."Opportunity"
(
    "tenant_id"            char(36),
    "opportunity_id"       char(36) PRIMARY KEY,
    "account_id"           char(36),
    "opportunity_owner_id" char(36),
    "opportunity_stage"    "pl"."OpportunityStage",
    "closed_date"          timestamp with time zone,
    "created_date"         timestamp with time zone,
    "amount"               numeric
);

CREATE TABLE "pl"."Quota"
(
    "tenant_id"      char(36),
    "quota_id"       char(36) PRIMARY KEY,
    "quota_owner_id" char(36),
    "amount"         numeric,
    "target_date"    timestamp with time zone
);

CREATE TABLE "pl"."Quote"
(
    "tenant_id"      char(36),
    "quote_id"       char(36) PRIMARY KEY,
    "opportunity_id" char(36)
);

CREATE TABLE "pl"."QuoteLineItem"
(
    "tenant_id"          char(36),
    "quote_line_item_id" char(36) PRIMARY KEY,
    "quote_id"           char(36),
    "product_id"         char(36),
    "amount"             numeric
);

CREATE TABLE "pl"."Product"
(
    "tenant_id"  char(36),
    "product_id" char(36) PRIMARY KEY
);

CREATE TABLE "pl"."Requisition"
(
    "tenant_id"            char(36),
    "requisition_id"       char(36) PRIMARY KEY,
    "worker_id"            char(36),
    "requisition_owner_id" char(36),
    "requisition_stage"    "pl"."RequisitionStage",
    "requisition_date"     timestamp with time zone
);

CREATE TABLE "pl"."Course"
(
    "tenant_id"  char(36),
    "course_id"  char(36) PRIMARY KEY,
    "product_id" char(36)
);

CREATE TABLE "pl"."CourseParticipation"
(
    "tenant_id"                   char(36),
    "course_participation_id"     char(36) PRIMARY KEY,
    "course_id"                   char(36),
    "participant_id"              char(36),
    "pre_course_assesment_score"  numeric,
    "post_course_assesment_score" numeric,
    "assigned_date"               timestamp with time zone,
    "start_date"                  timestamp with time zone,
    "completion_date"             timestamp with time zone,
    "satisfaction_score"          numeric
);

CREATE TABLE "pl"."Activity"
(
    "tenant_id"      char(36),
    "activity_id"    char(36) PRIMARY KEY,
    "opportunity_id" char(36),
    "activity_date"  timestamp with time zone,
    "activity_type"  "pl"."ActivityType",
    "duration_in_ms" numeric
);

ALTER TABLE "pl"."User"
    ADD FOREIGN KEY ("parent_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Account"
    ADD FOREIGN KEY ("account_owner_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Opportunity"
    ADD FOREIGN KEY ("account_id") REFERENCES "pl"."Account" ("account_id");

ALTER TABLE "pl"."Opportunity"
    ADD FOREIGN KEY ("opportunity_owner_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Quota"
    ADD FOREIGN KEY ("quota_owner_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Quote"
    ADD FOREIGN KEY ("opportunity_id") REFERENCES "pl"."Opportunity" ("opportunity_id");

ALTER TABLE "pl"."QuoteLineItem"
    ADD FOREIGN KEY ("quote_id") REFERENCES "pl"."Quote" ("quote_id");

ALTER TABLE "pl"."QuoteLineItem"
    ADD FOREIGN KEY ("product_id") REFERENCES "pl"."Product" ("product_id");

ALTER TABLE "pl"."Requisition"
    ADD FOREIGN KEY ("worker_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Requisition"
    ADD FOREIGN KEY ("requisition_owner_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Course"
    ADD FOREIGN KEY ("product_id") REFERENCES "pl"."Product" ("product_id");

ALTER TABLE "pl"."CourseParticipation"
    ADD FOREIGN KEY ("course_id") REFERENCES "pl"."Course" ("course_id");

ALTER TABLE "pl"."CourseParticipation"
    ADD FOREIGN KEY ("participant_id") REFERENCES "pl"."User" ("user_id");

ALTER TABLE "pl"."Activity"
    ADD FOREIGN KEY ("opportunity_id") REFERENCES "pl"."Opportunity" ("opportunity_id");
