--sql commands here

CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL,  
  name TEXT NOT NULL,
  description TEXT
);

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE node (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE
);

CREATE TABLE edge (
  source_id INTEGER REFERENCES node(id),
  target_id INTEGER REFERENCES node(id),
  project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username citext NOT NULL,
  password TEXT NOT NULL,
  email citext NOT NULL,
  UNIQUE (username),
  UNIQUE (email)
);

ALTER TABLE edge
ADD CONSTRAINT PK_edge PRIMARY KEY (source_id, target_id);

CREATE TABLE tag (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE tagged_nodes (
  node_id INTEGER REFERENCES node(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tag(id) ON DELETE CASCADE,
  PRIMARY KEY (node_id, tag_id)
);