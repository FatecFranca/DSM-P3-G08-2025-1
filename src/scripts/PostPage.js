document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Função para alternar o tema
    function toggleDarkMode() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateDarkModeIcon();
    }
    
    // Função para atualizar o ícone
    function updateDarkModeIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    // Inicializar o tema
    const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon();
    
    // Adicionar evento de clique
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Observar mudanças na preferência do sistema
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            updateDarkModeIcon();
        }
    });
}); 