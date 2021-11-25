--sql commands here


CREATE TABLE node (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL
);

CREATE TABLE edge (
  node_from INTEGER REFERENCES node(id), 
  node_to INTEGER REFERENCES node(id)
);

ALTER TABLE edge 
ADD CONSTRAINT PK_edge PRIMARY KEY (node_from, node_to);