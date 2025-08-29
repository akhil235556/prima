-- migrate:up
CREATE TABLE requests_log(
    id              SERIAL PRIMARY KEY,
    request_id      VARCHAR(255) NOT NULL,
    log_message     TEXT,
    event_time      TIMESTAMP DEFAULT NOW()
);

-- migrate:down
