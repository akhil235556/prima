-- migrate:up
CREATE TABLE planning_routes(
    request_id serial PRIMARY KEY,
    planning_request_id VARCHAR(255) NOT NULL,
    route_id VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(255),
    total_weight_carrying FLOAT,
    total_volume_carrying FLOAT,
    weight_utilisation FLOAT,
    volume_utilisation FLOAT,
    total_time FLOAT,
    total_kms FLOAT,
    total_cost FLOAT,
    from_city VARCHAR(255),
    to_city VARCHAR (255),
    details JSON
);

-- migrate:down