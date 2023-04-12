select
	"userId",
	"action" as activity,
	"actionCompleteDate" as due_date,
	"createdDate" as "nudgeDate",
	"doneDate",
	CONCAT("X_poor", ' >> ', "Y_poor") as impact,
	CONCAT(rtrim("outcome")) as outcome
from
	pl. "Notification" as Notification
	left join pl. "Recommendation" as Recommendation on Notification. "rec_id" = Recommendation. "id"
where
	"tenantId" = $1
	and "userId" = $2
	and Notification."doneDate" is not null;

-- 	need to add done date column