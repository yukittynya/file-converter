let convert_button; 
let file_input; 
let files = [];
let files_container; 
let target_format;
let zip_button; 

window.addEventListener('DOMContentLoaded', () => {
    file_input = document.getElementById('upload-files-input');
    files_container = document.getElementById('files-container');
    convert_button = document.getElementById('convert-items');
    zip_button = document.getElementById('download-all-zip');

    file_input.onchange = function() {
        uploadFiles(file_input.files);        
    }
});

function uploadFiles(files) {
    const formData = new FormData;

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    try {
        fetch("http://localhost:3030/api/upload", {
            method: 'POST',
            body: formData
        });
    } catch (err) {
        console.error("UploadFiles error", err);
    }
}

function set_target_format_for_all(format) {
    const format_text = document.getElementById('formats-button-text'); 
    const current_text = format_text.innerText;

    if (current_text !== 'n/a') {
        let id = current_text.split('.').pop();
        id += '-format';

        const existing_button = document.getElementById(id);
        existing_button.classList.toggle('active');
    }

    let id = format.split('.').pop();
    id += '-format';

    target_format = id;

    const format_button = document.getElementById(id); 
    format_button.classList.toggle('active');

    format_text.innerText = format;
}
