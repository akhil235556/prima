-- migrate:up
CREATE TABLE planning_vehicles(
    request_id VARCHAR(255) PRIMARY KEY,
    planning_request_id VARCHAR(255) NOT NULL,
    planning_route_id VARCHAR(255),
    vehicle_code VARCHAR(255),
    weight_capacity FLOAT,
    volume_capacity FLOAT,
    fixed_cost FLOAT,
    number_of_vehicles INTEGER
);

-- migrate:down
