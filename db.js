const Database = require("better-sqlite3");
const path = require("path");
const DB_PATH = path.join(__dirname, "expenses.db");
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id              TEXT PRIMARY KEY,
    amount          INTEGER NOT NULL,
    category        TEXT    NOT NULL,
    description     TEXT,
    date            TEXT    NOT NULL,
    created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    idempotency_key TEXT    UNIQUE NOT NULL
  );
`);
module.exports = db;
