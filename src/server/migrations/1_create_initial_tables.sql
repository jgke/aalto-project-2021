--sql commands here


CREATE TABLE node (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL
);