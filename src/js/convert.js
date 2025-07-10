let targetFormat;
let files = [];

document.addEventListener('change', function(e) {
    if (e.target.matches('#upload-files-input')) {
        files = [...files, ...e.target.files];
        uploadFiles();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.matches('.format-item')) {
        set_target_format_for_all(e.target.innerText);
    }

    if (e.target.matches('#convert-items')) {
        convertFiles(targetFormat);
    }
});

function createCards() {
    const container = document.getElementById('files-container'); 
 
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let fileHTML = `
            <div class="file-card" id="file-card-${i}">
                <div class="file-card-row">
                    <p class="file-card-name">${file.name}</p>
                    <button class="delete-file-card" onclick=deleteFileCard(${i})>x</button>
                </div>
                <img class="file-card-preview" src="/uploads/${file.name}" width="150" height="150">
            </div>
        `;
        

        container.insertAdjacentHTML('beforeend', fileHTML);
    }
}

async function deleteFileCard(id) {
    const fileCard = document.getElementById(`file-card-${id}`);
    const fileName = fileCard.querySelector('.file-card-name').innerText;
    const formData = new FormData;

    formData.append("file", fileName);

    try {
        const response = await fetch("http://localhost:3030/api/delete", {
            method: 'DELETE',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error deleting");
        }

        fileCard.remove();
        files = files.filter(file => file.name !== fileName);
    } catch (err) {
        console.log("Error deleting", err);
    }
}

async function uploadFiles() {
    const formData = new FormData;

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    try {
        const response = await fetch("http://localhost:3030/api/upload", {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("HTTP Error");
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        createCards();
    } catch (err) {
        console.error("Upload error", err);
    }
}

async function convertFiles(targetFormat) {
    const formData = new FormData;
    const fileNames = [];

    files.forEach((file) => {
        fileNames.push(file.name);
    });

    formData.append("fileNames", fileNames.join(','));
    formData.append("format", targetFormat);

    try {
        const response = await fetch("http://localhost:3030/api/convert", {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Convert error");
        }
    } catch (err) {
        console.error("Error: ", err);
    }
} 

async function downloadZip() {
    try {
        const response = await fetch("http://localhost:3030/api/downloadzip");

        if (!response.ok) {
            throw new Error("Download failed");
        }

        triggerDownload(await response.blob());
        files = [];
    } catch (err) {
        console.error("Download error, ", err);
    }
}

function triggerDownload(blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = "files.zip";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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

    const format_button = document.getElementById(id); 
    format_button.classList.toggle('active');

    format_text.innerText = format;

    targetFormat = format;
}
