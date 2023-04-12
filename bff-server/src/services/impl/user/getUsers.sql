SELECT * FROM "User" 
WHERE "userId" = ANY($1);