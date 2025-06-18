const realizarLogin = async () => {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;

    try {
        const response = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.id);
            window.location.href = '/perfil';
        } else {
            showNotification(`Erro: ${data.error}`, 'error');
        }
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        showNotification(`Erro: ${err.message}`, 'error');
    }
};

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    realizarLogin();
});

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, duration);
}

const toggleButton = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');
document.querySelector('.toggle-password').addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    toggleButton.querySelector('span').textContent = type === 'password' ? 'visibility' : 'visibility_off';
});