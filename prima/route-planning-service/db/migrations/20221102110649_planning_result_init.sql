-- migrate:up
CREATE TABLE planning_result(
    request_id serial PRIMARY KEY,
    planning_request_id VARCHAR(255) NOT NULL,
    total_vehicles INTEGER,
    total_routes INTEGER,
    total_orders INTEGER,
    total_duration VARCHAR(255),
    total_kms FLOAT,
    total_cost FLOAT,
    depot VARCHAR(255)
);

-- migrate:down
