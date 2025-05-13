// Dark mode toggle functionality
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
}

darkModeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Listen for system theme changes
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
}); 