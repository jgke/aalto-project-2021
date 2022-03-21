CREATE TABLE userAssign (
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    node_id INTEGER REFERENCES node(id) ON DELETE CASCADE,
    CONSTRAINT PK_userAssign PRIMARY KEY (users_id, node_id)
);
