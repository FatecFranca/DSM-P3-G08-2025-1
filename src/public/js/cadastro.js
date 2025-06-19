import showNotification from "./notificacao.js";

const form = document.getElementById('cadastroForm');
const profilePictureInput = document.getElementById('profilePicture');
const passwordInput = document.getElementById('password');
const togglePassword = document.querySelector('.toggle-password');
const fileNameDisplay = document.getElementById('fileName');

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let profilePicture = null;

    if (!username || !email || !password) {
        showNotification('Todos os campos são obrigatórios', 'error');
        return;
    }

    if (profilePictureInput.files && profilePictureInput.files[0]) {
        try {
            profilePicture = await getBase64(profilePictureInput.files[0]);
        } catch (error) {
            alert('Erro ao processar a imagem');
            return;
        }
    }

    const data = {
        nome: username,
        email: email,
        senha: password,
        foto: profilePicture,
    };

    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Erro ao cadastrar');
        }

        showNotification('Cadastro realizado com sucesso! Redirecionando...', 'success');
        setTimeout(() => {
            form.reset();
            window.location.href = '/login';
        }, 3000);
    } catch (error) {
        console.error('Erro na requisição:', error);
        showNotification(`Erro: ${error.message}`, 'error');
    }
});

profilePictureInput.addEventListener('change', () => {
    if (profilePictureInput.files && profilePictureInput.files.length > 0) {
        fileNameDisplay.textContent = profilePictureInput.files[0].name;
        fileNameDisplay.classList.remove('hidden');
    } else {
        fileNameDisplay.textContent = 'Nenhuma imagem selecionada';
        fileNameDisplay.classList.add('hidden');
    }
});

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.querySelector('span').textContent = type === 'password' ? 'visibility' : 'visibility_off';
});