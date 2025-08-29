-- migrate:up
CREATE TABLE client_planning_config(
    partition VARCHAR(255) PRIMARY KEY,
    tenant VARCHAR(255),
    node VARCHAR(255),
    planning_service VARCHAR(255),
    api_key VARCHAR(255),
    is_active boolean default True
);

-- migrate:down
