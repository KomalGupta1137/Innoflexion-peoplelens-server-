UPDATE pl."User"
SET "first_name" = $2, "last_name" = $3, "designation" = $4
WHERE "user_id" = $1;