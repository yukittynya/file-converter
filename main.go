package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	if err := os.MkdirAll("uploads", 0755); err != nil {
		fmt.Println("Failed creating uploads dir :/", err);
	}

	if err := os.MkdirAll("outputs", 0755); err != nil {
		fmt.Println("Failed creating uploads dir :/", err);
	}

	http.HandleFunc("/api/upload", handleFilesUpload)
	http.HandleFunc("/", spaHandler)

	fmt.Println("Listening :3")
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

func handleFilesUpload(w http.ResponseWriter, r *http.Request) {	
	err := r.ParseMultipartForm(250 << 20)

	if err != nil {
		fmt.Printf("Error parsing MultipartForm: %v\n", err)
		return
	}

	files := r.MultipartForm.File["files"]

	if len(files) == 0 {
		fmt.Println("No files recevied")
		return
	}

	for _, fHeader := range files {
		file, err := fHeader.Open()

		if err != nil {
			fmt.Println("Error opening file")
			fmt.Println(err)

			w.WriteHeader(http.StatusInternalServerError)
			return 
		}

		defer file.Close()

		dst, err := os.Create("./uploads/" + fHeader.Filename)
		if err != nil {
			fmt.Println("Error creating file on the server")
			fmt.Println(err)

			w.WriteHeader(http.StatusInternalServerError)
			return 
		}

		defer dst.Close()	

		if _, err := io.Copy(dst, file); err != nil {
			fmt.Println("Error copying file")
			fmt.Println(err)

			w.WriteHeader(http.StatusInternalServerError)
			return 
		}

		fmt.Printf("File %s uploaded and saved successfully", fHeader.Filename)
	}
}
