-- migrate:up
CREATE TABLE requests(
    request_id      VARCHAR(255) PRIMARY KEY,
    planning_name   VARCHAR(255) NOT NULL,
    status_code     INTEGER NOT NULL,
    status_name     VARCHAR(20) NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP,
    ended_at        TIMESTAMP,
    time_taken      INTEGER,
    response        JSON
);

-- migrate:down