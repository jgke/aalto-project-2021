--sql commands here

CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  owner_id TEXT NOT NULL,  
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE node (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  project_id SERIAL NOT NULL,
  CONSTRAINT fk_project_id
    FOREIGN KEY(project_id) 
    REFERENCES project(id)
    ON DELETE CASCADE
);

CREATE TABLE edge (
  source_id INTEGER REFERENCES node(id),
  target_id INTEGER REFERENCES node(id),
  project_id SERIAL NOT NULL,
  CONSTRAINT fk_project_id
    FOREIGN KEY(project_id) 
    REFERENCES project(id)
    ON DELETE CASCADE
);

ALTER TABLE edge
ADD CONSTRAINT PK_edge PRIMARY KEY (source_id, target_id);
