    WITH RECURSIVE SUBORDINATES AS (
                        SELECT USER_ID, first_name, last_name
                        FROM PL."User"
                        WHERE USER_ID = $1
                        UNION
                        SELECT U.USER_ID, U.first_name, U.last_name
                        FROM PL."User" U
                            INNER JOIN SUBORDINATES S ON S.USER_ID = U.PARENT_ID
                    )
                    SELECT user_id as "userId", first_name as "firstName", last_name as "lastName"
                    FROM SUBORDINATES;
