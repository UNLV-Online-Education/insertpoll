ALTER TABLE oe_courses.insertpoll_responses
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

UPDATE oe_courses.insertpoll_responses 
SET 
    created_at = "1000-01-01 00:00:00",
    updated_at = "1000-01-01 00:00:00";

ALTER TABLE oe_courses.insertpoll_polls
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

UPDATE oe_courses.insertpoll_polls 
SET 
    created_at = "1000-01-01 00:00:00",
    updated_at = "1000-01-01 00:00:00";