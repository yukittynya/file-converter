let file_input;
let files = [];

class File {
    constructor(file, name, target_type) {
        this.file = file
        this.name = name;
        this.target_type = target_type;
    }
}

function handle_upload() {
    for (let i = 0; i < file_input.files.length; i++) {
        files.push(new File(file_input.files[i], file_input.files[i], "mp4"));
        console.log("files:", files[i]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    file_input = document.getElementById('upload-files');

    file_input.addEventListener('change', handle_upload);
});
