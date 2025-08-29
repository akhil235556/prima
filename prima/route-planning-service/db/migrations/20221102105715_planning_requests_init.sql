-- migrate:up
CREATE TABLE planning_requests(
    request_id VARCHAR(255) PRIMARY KEY,
    tenant VARCHAR(255) NOT NULL,
    partition VARCHAR(255) NOT NULL,
    node VARCHAR(255) NOT NULL,
    planning_name VARCHAR(255) NOT NULL,
    status_code INTEGER NOT NULL,
    status_name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    ended_at TIMESTAMP,
    planning_start_time TIMESTAMP,
    planning_end_time TIMESTAMP,
    time_taken_hours FLOAT,
    total_tasks INTEGER,
    total_vehicles INTEGER,
    total_cost FLOAT,
    total_kms FLOAT,
    stops INTEGER,
    remarks TEXT
);

-- migrate:down
