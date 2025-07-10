package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {
	if err := os.MkdirAll("uploads", 0755); err != nil {
		fmt.Println("Failed creating uploads dir :/", err);
	}

	if err := os.MkdirAll("outputs", 0755); err != nil {
		fmt.Println("Failed creating uploads dir :/", err);
	}

	http.HandleFunc("/uploads/", serveUploads);

	http.HandleFunc("/api/upload", handleFilesUpload)
	http.HandleFunc("/api/delete", handleFilesDelete)
	http.HandleFunc("/api/convert", handleConvert)
	http.HandleFunc("/api/downloadzip", handleDownloadZip)

	//SPA Catch
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

		fmt.Printf("File %s uploaded and saved successfully\n", fHeader.Filename)
	}
}

func handleFilesDelete(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		fmt.Println("Error parsing")
		return
	}

	name := r.FormValue("file")

	if strings.Contains(name, "..") {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return	
	}

	if name == "" {
		http.Error(w, "No file", http.StatusBadRequest)
		return	
	}

    filePath := filepath.Join("./uploads", name);

	err = os.Remove(filePath)
	if err != nil {
		fmt.Printf("Error deleting file: %s\n", name)
		return
	}

	fmt.Printf("Deleted file, %s\n", name)
}

func handleConvert(w http.ResponseWriter, r *http.Request) {
	err := os.MkdirAll("./outputs", 0755)
	if err != nil {
		fmt.Println("Error making outputs directory")
		return
	}

	err = r.ParseMultipartForm(50 << 20)	
	if err != nil {
		fmt.Println("Error: Parsing")
		return
	}

	names := strings.Split(r.FormValue("fileNames"), ",")
	targetFormat := r.FormValue("format")

	for _, name := range names {
		name = strings.TrimSpace(name)
		if name == "" {
			continue
		}

		fmt.Printf("Converting file: %s\n", name)
		
		inputPath := filepath.Join("./uploads", name)
		outputFilename := strings.TrimSuffix(name, filepath.Ext(name)) + "." + targetFormat
		outputPath := filepath.Join("./outputs", outputFilename)

		cmd := exec.Command("ffmpeg", "-i", inputPath, "-y", outputPath)
		err = cmd.Run()
		if err != nil {
			fmt.Println("Cmd failed")
			return
		}

		err = os.Remove(inputPath)
		if err != nil {
			fmt.Printf("Couldnt delete: %s\n", inputPath)
		}

		fmt.Printf("Converted %s to %s\n", inputPath, outputFilename)
	}
}

func handleDownloadZip(w http.ResponseWriter, r *http.Request) {
	zipPath := "./outputs/files.zip"

	os.Remove(zipPath)

	err := os.MkdirAll("./outputs", 0755)
	if err != nil {
		fmt.Println("Error making outputs directory")
		return
	}

	cmd := exec.Command("zip", "-r", "files.zip", ".", "-x", "files.zip")
	cmd.Dir = "./outputs"

	err = cmd.Run()
	if err != nil {
		fmt.Println("Error zipping")
		return
	}

	http.ServeFile(w, r, zipPath)
	fmt.Println("Zip file served to user")

	os.RemoveAll("./outputs")
	os.MkdirAll("/outputs", 0755)
}

func serveUploads(w http.ResponseWriter, r *http.Request) {
	name := strings.TrimPrefix(r.URL.Path, "/uploads/")

	if strings.Contains(name, "..") {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return	
	}

	http.ServeFile(w, r, filepath.Join("./uploads", name))
}
