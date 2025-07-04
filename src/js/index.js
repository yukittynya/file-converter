const app = document.getElementById('app');
let loading = false;

function load_page(url, current_page) {
    if (loading) return;
    loading = true;
    
    const target = normalize_path(url);
    const file_path = target === '/' ? '/index.html' : `${target}.html`;

    const link0 = document.getElementById('link0');
    const link1 = document.getElementById('link1');
    const link2 = document.getElementById('link2');

    if (target === "/") {
        link0.classList.add('active'); 
        link1.classList.remove('active'); 
        link2.classList.remove('active'); 
    }

    if (target === "/convert") {
        link0.classList.remove('active');
        link1.classList.add('active'); 
        link2.classList.remove('active');
    }

    if (target === "/settings") {
        link0.classList.remove('active');
        link1.classList.remove('active'); 
        link2.classList.add('active');
    }
    
    fetch(file_path)
        .then(result => result.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;

            const new_page = temp.querySelector('.page');
            const current = app.querySelector('.page');
            
            if (current) {
                current.classList.remove('active');
               
                if (current_page === "/") {
                    current.classList.add('exit-left');
                }

                if (current_page === "/settings") {
                    current.classList.add('exit-right');
                }

                if (current_page === "/convert" && target === "/") {
                    current.classList.add('exit-right');
                }

                if (current_page === "/convert" && target === "/settings") {
                    current.classList.add('exit-left');
                }
                
                setTimeout(() => {
                    if (current && current.parentNode) {
                        app.removeChild(current);
                    }
                }, 500);
            }
            
            if (current_page === "/") {
                new_page.classList.add('enter-right');
            }

            if (current_page === "/settings") {
                new_page.classList.add('enter-left')
            }

            if (current_page === "/convert" && target === "/") {
                new_page.classList.add('enter-left')
            }

            if (current_page === "/convert" && target === "/settings") {
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
        })
        .catch(err => {
            console.error("Page loading failed:", err);

            app.innerHTML = `<div class="page active">
                <h1>Error loading ${url}</h1>
                <p>Page could not be loaded. Please try again.</p>
            </div>`;

            loading = false;
        });
}

function handle_link_click(e) {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    
    e.preventDefault();
    const href = link.getAttribute('href');
    const url = normalize_path(href);
    const current = normalize_path(window.location.pathname);
    
    if (current === url) return;
    
    history.pushState({ url: url, timestamp: Date.now() }, '', url);
    load_page(url, current);
}

function normalize_path(path) {
    return path
        .replace(/\/+$/, '')
        .replace(/\.html$/, '')
        .replace(/^\/?/, '/');
}

window.addEventListener('popstate', ()=> {
    const path = normalize_path(window.location.pathname);
    load_page(path);
});



document.addEventListener('click', handle_link_click);

document.addEventListener('DOMContentLoaded', () => {
    const current_path = normalize_path(window.location.pathname);

    if (!app.querySelector('.page')) {
        load_page(current_path);
    }
});

load_page("/");
