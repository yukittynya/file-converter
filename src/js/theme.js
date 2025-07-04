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

load_theme();
