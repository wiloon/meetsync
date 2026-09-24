package main

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
	"time"
)

var isoDatePattern = regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)

type createGatheringRequest struct {
	Title    string   `json:"title"`
	Dates    []string `json:"dates"`
	Timezone string   `json:"timezone"`
	Topics   []string `json:"topics"`
}

func validateCreateGatheringRequest(req createGatheringRequest) string {
	if strings.TrimSpace(req.Title) == "" {
		return "title is required"
	}
	if len(req.Dates) == 0 {
		return "at least one date is required"
	}
	for _, d := range req.Dates {
		if !isoDatePattern.MatchString(d) {
			return "dates must be in YYYY-MM-DD format"
		}
	}
	if _, err := time.LoadLocation(req.Timezone); err != nil {
		return "timezone must be a valid IANA zone name"
	}
	return ""
}

func createGatheringHandler(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req createGatheringRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSONError(w, http.StatusBadRequest, "invalid JSON body")
			return
		}

		if msg := validateCreateGatheringRequest(req); msg != "" {
			writeJSONError(w, http.StatusBadRequest, msg)
			return
		}

		topics := make([]string, 0, len(req.Topics))
		for _, name := range req.Topics {
			if trimmed := strings.TrimSpace(name); trimmed != "" {
				topics = append(topics, trimmed)
			}
		}

		created, err := store.CreateGathering(Gathering{
			Title:    strings.TrimSpace(req.Title),
			Dates:    req.Dates,
			Timezone: req.Timezone,
			Topics:   topics,
		})
		if err != nil {
			writeJSONError(w, http.StatusInternalServerError, "could not create gathering")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(created)
	}
}

func getGatheringHandler(store *Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := strings.TrimPrefix(r.URL.Path, "/api/gatherings/")
		if slug == "" {
			writeJSONError(w, http.StatusBadRequest, "slug is required")
			return
		}

		g, err := store.GetGathering(slug)
		if err == ErrGatheringNotFound {
			writeJSONError(w, http.StatusNotFound, "gathering not found")
			return
		}
		if err != nil {
			writeJSONError(w, http.StatusInternalServerError, "could not fetch gathering")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(g)
	}
}

func gatheringsHandler(store *Store) http.HandlerFunc {
	create := createGatheringHandler(store)
	get := getGatheringHandler(store)
	return func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.Method == http.MethodPost && r.URL.Path == "/api/gatherings":
			create(w, r)
		case r.Method == http.MethodGet && strings.HasPrefix(r.URL.Path, "/api/gatherings/"):
			get(w, r)
		default:
			writeJSONError(w, http.StatusMethodNotAllowed, "method not allowed")
		}
	}
}

func writeJSONError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
