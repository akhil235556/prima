-- migrate:up
CREATE TABLE planning_errors(
    request_id serial PRIMARY KEY,
    planning_request_id VARCHAR(255) NOT NULL,
    planning_tasks_id VARCHAR(255),
    error_name VARCHAR(20),
    error_row_no INTEGER,
    error_sheet VARCHAR(20),
    error_message VARCHAR(255),
    error_details JSON
);

-- migrate:down