package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateGatheringHandler(t *testing.T) {
	store := newTestStore(t)
	handler := gatheringsHandler(store)

	body, _ := json.Marshal(createGatheringRequest{
		Title:    "Catching up",
		Dates:    []string{"2026-10-03", "2026-10-04"},
		Timezone: "America/Los_Angeles",
		Topics:   []string{"Dinner", "  ", "Coffee"},
	})
	req := httptest.NewRequest(http.MethodPost, "/api/gatherings", bytes.NewReader(body))
	rec := httptest.NewRecorder()

	handler(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d: %s", rec.Code, rec.Body.String())
	}

	var got Gathering
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatalf("response was not valid JSON: %v", err)
	}
	if got.Slug == "" {
		t.Error("expected a non-empty slug")
	}
	if len(got.Topics) != 2 {
		t.Errorf("expected blank topic to be dropped, got %v", got.Topics)
	}
}

func TestCreateGatheringHandlerValidation(t *testing.T) {
	store := newTestStore(t)
	handler := gatheringsHandler(store)

	cases := []struct {
		name string
		req  createGatheringRequest
	}{
		{"missing title", createGatheringRequest{Dates: []string{"2026-10-03"}, Timezone: "UTC"}},
		{"missing dates", createGatheringRequest{Title: "x", Timezone: "UTC"}},
		{"bad date format", createGatheringRequest{Title: "x", Dates: []string{"10/03/2026"}, Timezone: "UTC"}},
		{"bad timezone", createGatheringRequest{Title: "x", Dates: []string{"2026-10-03"}, Timezone: "Not/AZone"}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			body, _ := json.Marshal(c.req)
			req := httptest.NewRequest(http.MethodPost, "/api/gatherings", bytes.NewReader(body))
			rec := httptest.NewRecorder()
			handler(rec, req)
			if rec.Code != http.StatusBadRequest {
				t.Fatalf("expected 400, got %d: %s", rec.Code, rec.Body.String())
			}
		})
	}
}

func TestGetGatheringHandler(t *testing.T) {
	store := newTestStore(t)
	created, err := store.CreateGathering(Gathering{Title: "x", Dates: []string{"2026-10-03"}, Timezone: "UTC", Topics: []string{"Dinner"}})
	if err != nil {
		t.Fatalf("CreateGathering: %v", err)
	}

	handler := gatheringsHandler(store)
	req := httptest.NewRequest(http.MethodGet, "/api/gatherings/"+created.Slug, nil)
	rec := httptest.NewRecorder()
	handler(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", rec.Code, rec.Body.String())
	}
	var got Gathering
	if err := json.Unmarshal(rec.Body.Bytes(), &got); err != nil {
		t.Fatalf("response was not valid JSON: %v", err)
	}
	if got.Title != "x" {
		t.Errorf("Title = %q, want %q", got.Title, "x")
	}
}

func TestGetGatheringHandlerNotFound(t *testing.T) {
	store := newTestStore(t)
	handler := gatheringsHandler(store)
	req := httptest.NewRequest(http.MethodGet, "/api/gatherings/doesnotexist", nil)
	rec := httptest.NewRecorder()
	handler(rec, req)

	if rec.Code != http.StatusNotFound {
		t.Fatalf("expected 404, got %d: %s", rec.Code, rec.Body.String())
	}
}
