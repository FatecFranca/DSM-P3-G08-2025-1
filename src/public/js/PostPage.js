document.addEventListener('DOMContentLoaded', () => {
    
    const profileBtn = $('.profile-btn');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const html = document.documentElement;

    // Função para alternar o tema
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Atualizar o tema
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Atualizar ícone
        const img = darkModeToggle.querySelector('img');
        if (img) {
            img.src = newTheme === 'dark' ? 
                '../images/light_mode.svg' : 
                '../images/dark_mode.svg';
        }
    }

    // Inicializar tema
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        
        // Atualizar ícone
        const img = darkModeToggle.querySelector('img');
        if (img) {
            img.src = savedTheme === 'dark' ? 
                '../images/light_mode.svg' : 
                '../images/dark_mode.svg';
        }
    }

    // Adicionar evento de clique
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleTheme);
    }

    profileBtn.on('click', function() {
        window.location.href = 'cadastro.html';
    });

    // Inicializar
    initializeTheme();
}); 