-- create_table.sql

CREATE TABLE IF NOT EXISTS users_revenue (
  user_id TEXT PRIMARY KEY,
  revenue INTEGER NOT NULL DEFAULT 0
);
