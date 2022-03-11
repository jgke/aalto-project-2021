CREATE TABLE userBelongProject (
  users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES project(id) ON DELETE CASCADE
);

ALTER TABLE userBelongProject
ADD CONSTRAINT PK_userBelongProject PRIMARY KEY (users_id, project_id);