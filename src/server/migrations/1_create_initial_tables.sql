--sql commands here

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE project (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id TEXT NOT NULL,  
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE node (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  label TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  x DOUBLE PRECISION NOT NULL,
  y DOUBLE PRECISION NOT NULL,
  project_id uuid NOT NULL,
  CONSTRAINT fk_project_id
    FOREIGN KEY(project_id) 
    REFERENCES project(id)
    ON DELETE CASCADE
);

CREATE TABLE edge (
  source_id uuid REFERENCES node(id),
  target_id uuid REFERENCES node(id),
  project_id uuid NOT NULL,
  CONSTRAINT fk_project_id
    FOREIGN KEY(project_id) 
    REFERENCES project(id)
    ON DELETE CASCADE
);

CREATE TABLE users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  username citext NOT NULL,
  password TEXT NOT NULL,
  email citext NOT NULL,
  UNIQUE (username),
  UNIQUE (email)
);

ALTER TABLE edge
ADD CONSTRAINT PK_edge PRIMARY KEY (source_id, target_id);
