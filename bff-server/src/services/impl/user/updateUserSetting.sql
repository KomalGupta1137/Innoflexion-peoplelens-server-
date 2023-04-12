INSERT INTO pl."UserSetting" ("userId", "notification", "calendar", "timeline", "overview", "leaderboard", "reports", "people", "customer") 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT ("userId") DO UPDATE 
  SET 
  	"notification" = $2,
	"calendar" = $3,
	"timeline" = $4,
	"overview" = $5,
	"leaderboard" = $6,
	"reports" = $7,
	"people" = $8,
	"customer" = $9;