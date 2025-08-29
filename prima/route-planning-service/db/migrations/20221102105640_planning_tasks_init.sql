-- migrate:up
CREATE TABLE planning_tasks(
    request_id VARCHAR(255) PRIMARY KEY,
    planning_request_id VARCHAR(255) NOT NULL,
    planning_route_id VARCHAR(255),
    order_id VARCHAR(255),
    consignee_location VARCHAR(255),
    consignee VARCHAR(255),
    weight_kg FLOAT,
    volume_cbm FLOAT,
    dispatched_by TIMESTAMP,
    priority VARCHAR(20)
);

-- migrate:down

