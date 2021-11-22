--sql commands here

CREATE TABLE example (
  a TEXT, 
  b TEXT
);

CREATE TABLE node (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL
);


INSERT INTO example (a, b) VALUES ('here you can put', 'some dummy data');
