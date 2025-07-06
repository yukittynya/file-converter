package main;

import (
	"log"
	"net/http"
	"os"
)

func main() {
	if err := os.MkdirAll("uploads", 0755); err != nil {
		log.Fatal("Failed creating uploads dir :/", err);
	}

	if err := os.MkdirAll("outputs", 0755); err != nil {
		log.Fatal("Failed creating uploads dir :/", err);
	}

	fs := http.FileServer(http.Dir("./src/"));
	http.Handle("/", fs);

	http.ListenAndServe(":3030", nil);
}
