CREATE TYPE "pl"."Persona" AS ENUM (
    'LEADER',
    'SDR',
    'AE',
    'CS',
    'SE'
    );

ALTER TABLE "pl"."User" ADD COLUMN "persona" "pl"."Persona" NULL;
