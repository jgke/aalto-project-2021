--sql commands here

CREATE TABLE node (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL
);

CREATE TABLE edge (
    id SERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES node(id),
    target_id INTEGER REFERENCES node(id)
);