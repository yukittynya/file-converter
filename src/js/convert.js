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

    file_input.addEventListener('change', upload_files);
});

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

function upload_files() {
    files = [...files, ...file_input.files];
}

function clear_files() {
    for (let i = 0; i < files.length; i++) {
        files.pop();
    }
}
