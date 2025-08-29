-- migrate:up
CREATE TABLE client_solver_config(
    id serial PRIMARY KEY,
    api_key VARCHAR(255),
    solver_name VARCHAR(255),
    is_active boolean default True
);

-- migrate:down

