package main

import (
	"database/sql"

	_ "modernc.org/sqlite"
)

const schema = `
CREATE TABLE IF NOT EXISTS gatherings (
	slug       TEXT PRIMARY KEY,
	title      TEXT NOT NULL,
	timezone   TEXT NOT NULL,
	dates_json TEXT NOT NULL,
	created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
	id             INTEGER PRIMARY KEY AUTOINCREMENT,
	gathering_slug TEXT NOT NULL REFERENCES gatherings(slug),
	name           TEXT NOT NULL,
	created_at     TEXT NOT NULL
);
`

// Store is the SQLite-backed persistence layer, per ADR-0014.
type Store struct {
	db *sql.DB
}

func OpenStore(dataSourceName string) (*Store, error) {
	db, err := sql.Open("sqlite", dataSourceName)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	if _, err := db.Exec(schema); err != nil {
		return nil, err
	}
	// SQLite only supports one writer at a time; a single connection avoids
	// SQLITE_BUSY errors under concurrent requests instead of masking them.
	db.SetMaxOpenConns(1)
	return &Store{db: db}, nil
}

func (s *Store) Close() error {
	return s.db.Close()
}
