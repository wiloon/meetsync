package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"
)

// Gathering is created once by its Organizer and never edited afterward
// (see docs/adr and issue #1's Out of Scope).
type Gathering struct {
	Slug     string   `json:"slug"`
	Title    string   `json:"title"`
	Dates    []string `json:"dates"`    // ISO 8601 dates (YYYY-MM-DD), the Gathering Timezone's own calendar
	Timezone string   `json:"timezone"` // IANA zone name, e.g. "America/Los_Angeles"
	Topics   []string `json:"topics"`
}

var ErrGatheringNotFound = errors.New("gathering not found")

const slugAlphabet = "abcdefghijkmnpqrstuvwxyz23456789" // no 0/o/1/l, easy to read aloud
const slugLength = 8

func generateSlug() (string, error) {
	b := make([]byte, slugLength)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	for i, v := range b {
		b[i] = slugAlphabet[int(v)%len(slugAlphabet)]
	}
	return string(b), nil
}

// CreateGathering persists a new Gathering under a freshly generated slug,
// retrying on the astronomically unlikely case of a collision.
func (s *Store) CreateGathering(g Gathering) (Gathering, error) {
	const maxAttempts = 5
	for attempt := 0; attempt < maxAttempts; attempt++ {
		slug, err := generateSlug()
		if err != nil {
			return Gathering{}, err
		}

		datesJSON, err := json.Marshal(g.Dates)
		if err != nil {
			return Gathering{}, err
		}

		tx, err := s.db.Begin()
		if err != nil {
			return Gathering{}, err
		}

		_, err = tx.Exec(
			`INSERT INTO gatherings (slug, title, timezone, dates_json, created_at) VALUES (?, ?, ?, ?, ?)`,
			slug, g.Title, g.Timezone, string(datesJSON), time.Now().UTC().Format(time.RFC3339),
		)
		if err != nil {
			tx.Rollback()
			if isUniqueConstraintErr(err) {
				continue // slug collision, try again with a new one
			}
			return Gathering{}, err
		}

		for _, name := range g.Topics {
			if _, err := tx.Exec(
				`INSERT INTO topics (gathering_slug, name, created_at) VALUES (?, ?, ?)`,
				slug, name, time.Now().UTC().Format(time.RFC3339),
			); err != nil {
				tx.Rollback()
				return Gathering{}, err
			}
		}

		if err := tx.Commit(); err != nil {
			return Gathering{}, err
		}

		g.Slug = slug
		return g, nil
	}
	return Gathering{}, fmt.Errorf("could not generate a unique slug after %d attempts", maxAttempts)
}

func isUniqueConstraintErr(err error) bool {
	return err != nil && strings.Contains(strings.ToLower(err.Error()), "unique")
}

// GetGathering looks up a Gathering by its shareable slug.
func (s *Store) GetGathering(slug string) (Gathering, error) {
	var g Gathering
	var datesJSON string
	err := s.db.QueryRow(
		`SELECT slug, title, timezone, dates_json FROM gatherings WHERE slug = ?`, slug,
	).Scan(&g.Slug, &g.Title, &g.Timezone, &datesJSON)
	if errors.Is(err, sql.ErrNoRows) {
		return Gathering{}, ErrGatheringNotFound
	}
	if err != nil {
		return Gathering{}, err
	}
	if err := json.Unmarshal([]byte(datesJSON), &g.Dates); err != nil {
		return Gathering{}, err
	}

	rows, err := s.db.Query(`SELECT name FROM topics WHERE gathering_slug = ? ORDER BY id`, slug)
	if err != nil {
		return Gathering{}, err
	}
	defer rows.Close()
	g.Topics = []string{}
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return Gathering{}, err
		}
		g.Topics = append(g.Topics, name)
	}
	return g, rows.Err()
}
