function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);

    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        const icon = darkModeButton.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;

    html.setAttribute('data-theme', savedTheme);

    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        const icon = darkModeButton.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }
});