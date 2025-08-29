-- migrate:up
ALTER TABLE planning_result ALTER COLUMN total_duration TYPE VARCHAR(255);

-- migrate:down

