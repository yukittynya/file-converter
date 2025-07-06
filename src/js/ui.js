function toggle_theme() {
    const current = document.documentElement.getAttribute('data-theme');
    const theme = current === 'dark' ? 'light' : 'dark'; 

    document.documentElement.setAttribute('data-theme', theme);

    localStorage.setItem('theme', theme);
}

function load_theme() {
    const theme = localStorage.getItem('theme');

    document.documentElement.setAttribute('data-theme', theme);
}

function toggle_dropdown() {
    const current = document.documentElement.getAttribute('dropdown-status');
    const status = current === 'closed' ? 'expanded' : 'closed';

    document.documentElement.setAttribute('dropdown-status', status);

    const formats_dropdown = document.querySelector('.formats-content');
    formats_dropdown.classList.toggle('expanded');
}

function load_dropdown() {
    document.documentElement.setAttribute('dropdown-status', 'closed');
}

load_theme();
load_dropdown();
