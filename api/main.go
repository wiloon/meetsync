package main

import (
	"log"
	"net/http"
	"os"
)

// corsMiddleware allows the local Next.js dev server to call this API
// cross-origin. Fine for local development; revisit before any real deploy.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	dbPath := os.Getenv("MEETSYNC_DB_PATH")
	if dbPath == "" {
		dbPath = "meetsync.db"
	}
	store, err := OpenStore(dbPath)
	if err != nil {
		log.Fatalf("could not open store at %s: %v", dbPath, err)
	}
	defer store.Close()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", healthHandler)
	mux.HandleFunc("/api/gatherings", gatheringsHandler(store))
	mux.HandleFunc("/api/gatherings/", gatheringsHandler(store))

	addr := ":8080"
	log.Printf("meetsync-api listening on %s", addr)
	if err := http.ListenAndServe(addr, corsMiddleware(mux)); err != nil {
		log.Fatal(err)
	}
}
