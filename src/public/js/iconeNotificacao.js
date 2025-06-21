document.addEventListener('DOMContentLoaded', async () => {
  const usuarioId = localStorage.getItem('userId');
  if (!usuarioId) return;

  try {
    const [convitesRes, notificacoesRes] = await Promise.all([
      fetch(`/api/convites/pendentes/${usuarioId}`),
      fetch(`/api/notificacoes/usuario/${usuarioId}`)
    ]);

    const convites = await convitesRes.json();
    const notificacoes = await notificacoesRes.json();

    const btn = document.querySelector('.notification-btn');
    if (!btn) {
      console.warn('Botão .notification-btn não encontrado!');
      return;
    }

    let badge = btn.querySelector('.notification-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.classList.add('notification-badge');
      btn.appendChild(badge);
    }

    const total = (Array.isArray(convites) ? convites.length : 0) + 
                  (Array.isArray(notificacoes) ? notificacoes.filter(n => !n.lida).length : 0)

    if (total > 0) {
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }

  } catch (err) {
    console.error('Erro ao buscar notificações:', err);
  }
});

document.querySelector('.notification-btn').addEventListener('click', () => {
  window.location.href = '/notificacoes';
});