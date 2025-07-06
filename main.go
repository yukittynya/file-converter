package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	if err := os.MkdirAll("uploads", 0755); err != nil {
		log.Fatal("Failed creating uploads dir :/", err);
	}

	if err := os.MkdirAll("outputs", 0755); err != nil {
		log.Fatal("Failed creating uploads dir :/", err);
	}

	//fs := http.FileServer(http.Dir("./src/"));

	http.HandleFunc("/", spaHandler)
	http.ListenAndServe(":3030", nil);
}

func spaHandler(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join("./src", path);

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join("./src", "index.html"))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.ServeFile(w, r, path)
}
