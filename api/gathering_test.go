package main

import (
	"testing"
)

func newTestStore(t *testing.T) *Store {
	t.Helper()
	s, err := OpenStore(":memory:")
	if err != nil {
		t.Fatalf("OpenStore: %v", err)
	}
	t.Cleanup(func() { s.Close() })
	return s
}

func TestCreateAndGetGathering(t *testing.T) {
	s := newTestStore(t)

	created, err := s.CreateGathering(Gathering{
		Title:    "Catching up with the old team",
		Dates:    []string{"2026-10-03", "2026-10-04", "2026-10-10"},
		Timezone: "America/Los_Angeles",
		Topics:   []string{"Dinner", "Coffee"},
	})
	if err != nil {
		t.Fatalf("CreateGathering: %v", err)
	}
	if created.Slug == "" {
		t.Fatal("expected a generated slug")
	}

	got, err := s.GetGathering(created.Slug)
	if err != nil {
		t.Fatalf("GetGathering: %v", err)
	}
	if got.Title != created.Title {
		t.Errorf("Title = %q, want %q", got.Title, created.Title)
	}
	if got.Timezone != created.Timezone {
		t.Errorf("Timezone = %q, want %q", got.Timezone, created.Timezone)
	}
	if len(got.Dates) != 3 {
		t.Errorf("Dates = %v, want 3 entries", got.Dates)
	}
	if len(got.Topics) != 2 || got.Topics[0] != "Dinner" || got.Topics[1] != "Coffee" {
		t.Errorf("Topics = %v, want [Dinner Coffee]", got.Topics)
	}
}

func TestCreateGatheringWithNoTopics(t *testing.T) {
	s := newTestStore(t)

	created, err := s.CreateGathering(Gathering{
		Title:    "Untitled gathering",
		Dates:    []string{"2026-11-01"},
		Timezone: "UTC",
	})
	if err != nil {
		t.Fatalf("CreateGathering: %v", err)
	}

	got, err := s.GetGathering(created.Slug)
	if err != nil {
		t.Fatalf("GetGathering: %v", err)
	}
	if len(got.Topics) != 0 {
		t.Errorf("Topics = %v, want empty", got.Topics)
	}
}

func TestGetGatheringNotFound(t *testing.T) {
	s := newTestStore(t)

	_, err := s.GetGathering("doesnotexist")
	if err != ErrGatheringNotFound {
		t.Fatalf("err = %v, want ErrGatheringNotFound", err)
	}
}

func TestGeneratedSlugsAreUnique(t *testing.T) {
	s := newTestStore(t)
	seen := map[string]bool{}
	for i := 0; i < 50; i++ {
		g, err := s.CreateGathering(Gathering{Title: "x", Dates: []string{"2026-01-01"}, Timezone: "UTC"})
		if err != nil {
			t.Fatalf("CreateGathering: %v", err)
		}
		if seen[g.Slug] {
			t.Fatalf("duplicate slug generated: %s", g.Slug)
		}
		seen[g.Slug] = true
	}
}
