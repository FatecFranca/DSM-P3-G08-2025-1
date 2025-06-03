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
        const icon = darkModeButton.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
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
        const icon = darkModeButton.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
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