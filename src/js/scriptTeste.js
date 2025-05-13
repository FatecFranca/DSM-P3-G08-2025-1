// Função para alternar o modo escuro
function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Atualizar o atributo data-theme
    html.setAttribute('data-theme', newTheme);
    
    // Salvar a preferência
    localStorage.setItem('theme', newTheme);
    
    // Atualizar ícone do botão
    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        const img = darkModeButton.querySelector('img');
        if (img) {
            img.src = newTheme === 'dark' ? 
                'src/images/light_mode.svg' : 
                'src/images/dark_mode.svg';
        }
    }
}

// Inicializar tema
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    
    // Definir o tema inicial
    html.setAttribute('data-theme', savedTheme);
    
    // Atualizar ícone do botão
    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        const img = darkModeButton.querySelector('img');
        if (img) {
            img.src = savedTheme === 'dark' ? 
                'src/images/light_mode.svg' : 
                'src/images/dark_mode.svg';
        }
    }
}

// Adicionar event listener quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    // Adicionar evento de clique ao botão
    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }
});