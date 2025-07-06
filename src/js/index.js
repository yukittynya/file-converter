const app = document.getElementById('app'); 
let loading = false;

function load_page(page, current_page) {
    if (loading) return;
    loading = true;
    
    const link0 = document.getElementById('link0');
    const link1 = document.getElementById('link1');
    const link2 = document.getElementById('link2');
    
    [link0, link1, link2].forEach(link => link?.classList.remove('active'));
    
    if (page === 'home') {
        link0?.classList.add('active');
    } else if (page === 'convert') {
        link1?.classList.add('active');
    } else if (page === 'settings') {
        link2?.classList.add('active');
    }
    
    let new_page_content = '';
    
    switch(page) { 
        case 'home':
            new_page_content = `
                <section class="page" data-page="home">
                    <div class="container">
                        <div class="message-container">
                            <h2 class="home-message">This is a silly little project that I am doing for myself, with the goal of improving my fullstack skills yippee</h2>
                            <p class="home-message-two">File converter for all video, image and document formats </p> 
                        </div>

                            <div id="redirect-convert")">
                                <input type="file" id="upload-files" onclick="load_page('convert', 'home')" multiple accept="image/*">
                                <h1 class="redirect-header">Start converting</h1>
                                <svg id="redirect-convert-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-up-icon lucide-folder-up"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M12 10v6"/><path d="m9 13 3-3 3 3"/></svg>
                                <h4 id="redirect-convert-text">Click to convert</h4>
                            </div>
                    </div>
                </section>
            `;
            break;

        case 'convert':
            new_page_content = `
                <section class="page" data-page="convert">
                    <div class="container">
                        <div class="options-container"> 
                            <button id="download-all-zip">
                                <svg id="download-all-zip-icon"xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
                                <h4 id="download-all-zip-text">Download as .zip</h4>
                            </button>
    
                            <button id="convert-items">
                                <svg id="convert-items-icon"xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw-icon lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> 
                                <h4 id="convert-items-text">Convert All</h4> 
                            </button>

                            <div class="formats-dropdown">
                                <h4 id="formats-text">Convert to </h4>
                                <button id="formats-button" onclick="toggle_dropdown()">
                                    <h4 id="formats-button-text">n/a</h4>
                                    <svg id="expand-dropdown" class="formats-button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                                    <svg id="close-dropdown" class="formats-button-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
                                </button>

                                <div class="formats-content">
                                    <input id="format-search" name="format-search" type="text" placeholder="Search formats">
                                    
                                    <div class="formats-grid">
                                        <button class="format-item" id="png-format">png</button>
                                        <button class="format-item" id="jpg-format">jpg</button>
                                        <button class="format-item" id="gif-format">gif</button>
                                        <button class="format-item" id="webp-format">webp</button>
                                        <button class="format-item" id="tiff-format">tiff</button>
                                        <button class="format-item" id="bmp-format">bmp</button>
                                        <button class="format-item" id="heif-format">heif</button>
                                        <button class="format-item" id="svg-format">svg</button>
                                        <button class="format-item" id="raw-format">raw</button>
                                    </div>
                                </div>
                            </div>

                            <div class="files-container">
                                <div class="file-card">
                                    
                                </div>
                            </div>
                        </div>
                    </div> 
                </section>
            `;
            break;

        case 'settings':
            new_page_content = `
                <section class="page" data-page="settings">
                    <div class="container">
                        <h1 class="container-header">Settings</h1>
                    </div> 
                </section>
            `;
            break;

        default:
            new_page_content = `
                <section class="page active" data-page="error">
                    <div class="container">
                        <h1 class="container-header">Page Not Found</h1>
                        <p>The requested page could not be found.</p>
                    </div> 
                </section>
            `;

            loading = false;
            app.innerHTML = new_page_content;
            return;
    }
    
    const temp = document.createElement('div');
    temp.innerHTML = new_page_content;

    const new_page = temp.querySelector('.page');
    const current = app.querySelector('.page');
    
    if (current) {
        current.classList.remove('active');
        
        if (current_page === 'home') {
            current.classList.add('exit-left');
        } else if (current_page === 'settings') {
            current.classList.add('exit-right');
        } else if (current_page === 'convert' && page === 'home') {
            current.classList.add('exit-right');
        } else if (current_page === 'convert' && page === 'settings') {
            current.classList.add('exit-left');
        }
        
        setTimeout(() => {
            if (current && current.parentNode) {
                app.removeChild(current);
            }
        }, 500);
    }
    
    if (current_page === 'home') {
        new_page.classList.add('enter-right');
    } else if (current_page === 'settings') {
        new_page.classList.add('enter-left');
    } else if (current_page === 'convert' && page === 'home') {
        new_page.classList.add('enter-left');
    } else if (current_page === 'convert' && page === 'settings') {
        new_page.classList.add('enter-right');
    }
    
    app.appendChild(new_page);
    
    requestAnimationFrame(() => {
        new_page.offsetHeight; 
        new_page.classList.remove('enter-right', 'enter-left');
        new_page.classList.add('active');
        
        setTimeout(() => {
            loading = false;
        }, 500);
    });
}

function normalize_page(path) {
    const clean_path = path.replace(/\/+$/, '') || '/';

    const page_map = {
        '/': 'home',
        '/home': 'home',
        '/convert': 'convert',
        '/settings': 'settings'
    };
    
    return page_map[clean_path] || 'home';
}

function handle_link_click(e) {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    
    e.preventDefault();
    const href = link.getAttribute('href');
    const page = normalize_page(href);
    const current_page = app.querySelector('.page')?.getAttribute('data-page') || 'home';

    if (current_page === page) return;
    
    history.pushState({ page: page, timestamp: Date.now() }, '', href);
    load_page(page, current_page);
}

window.addEventListener('popstate', () => {
    const page = normalize_page(window.location.pathname);
    const current_page = app.querySelector('.page')?.getAttribute('data-page') || 'home';
    load_page(page, current_page);
});

document.addEventListener('DOMContentLoaded', () => {
    const current_path = window.location.pathname;
    const page = normalize_page(current_path);
    load_page(page, 'home');
});

document.addEventListener('click', handle_link_click);
