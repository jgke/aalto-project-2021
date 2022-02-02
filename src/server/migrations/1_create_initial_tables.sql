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
  source_id INTEGER REFERENCES node(id),
  target_id INTEGER REFERENCES node(id)
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