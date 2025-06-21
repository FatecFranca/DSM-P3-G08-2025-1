import showNotification from "./showNotification.js";

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.main-content');
    
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) return;

    carregarNotificacoes(usuarioId, container);

    try {
        const res = await fetch(`/api/convites/pendentes-detalhados/${usuarioId}`);
        const convites = await res.json();

        if (convites.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'Você não possui convites pendentes.';
            container.appendChild(msg);
            return;
        }

        const logos = {
            'league of legends': 'lol.png',
            'valorant': 'valorant.jpg',
            'dota 2': 'dota2.png',
            'counter strike 2': 'cs.png',
            'apex legends': 'apex.png',
            'fortnite': 'fortnite.png',
            'overwatch 2': 'overwatch2.png',
        };

        convites.forEach(convite => {
            const perfil = convite.perfil_remetente;
            const usuario = perfil.usuario;
            const jogoNome = perfil.jogo?.nome || 'Jogo Desconhecido';
            const logo = logos[jogoNome.toLowerCase()] || 'default.png';

            const card = document.createElement('div');
            card.classList.add('publicacao');

            card.innerHTML = `
                <div class="header-publicacao">
                    <div class="autor-perfil">
                        <img src="${usuario?.foto || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'}" alt="${perfil.nickname}">
                        <h2>${perfil.nickname}</h2>
                    </div>
                    <div class="detalhes-perfil">
                        <div class="logoJogo">
                            <img src="/images/logos/${logo}">
                            <h4>${jogoNome}</h4>
                        </div>
                        <p>Nível: ${perfil.nivel || 'Não informado'}</p>
                    </div>
                </div>
                <p class="descricao-perfil">${usuario?.descricao || 'Descrição não informada'}</p>
                <div class="publicacao-content">
                    <p>Personagem favorito: ${perfil.personagem_favorito || 'Não informado'}</p>
                    <p>Frequência: ${perfil.frequencia_joga || 'Não informado'}</p>
                </div>
                <div class="footer-convite">
                    <p class="convite-texto">Deseja aceitar ou recusar este convite?</p>
                    <div class="opcoes-status">
                        <button class="recusar-convite" data-id="${convite.id}">
                            <span class="material-symbols-outlined">close</span>
                            <span>Recusar convite</span>
                        </button>
                        <button class="aceitar-convite" data-id="${convite.id}">
                            <span class="material-symbols-outlined">check</span>
                            <span>Aceitar convite</span>
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        document.addEventListener('click', (event) => {
            const botao = event.target.closest('.aceitar-convite, .recusar-convite');
            if (!botao) return;

            atualizarStatusConvite({ currentTarget: botao });
        });

    } catch (err) {
        console.error('Erro ao carregar convites:', err);
    }
});

const atualizarStatusConvite = async (event) => {
    const botao = event.currentTarget;
    const id = botao.getAttribute('data-id');
    const novoStatus = botao.classList.contains('aceitar-convite') ? 'Aceito' : 'Recusado';

    try {
        const res = await fetch(`/api/convites/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus }),
        });

        if (res.status === 204) {
            const conviteRes = await fetch(`/api/convites/${id}?include=perfil_destinatario.jogador,perfil_remetente.jogador`);
            const convite = await conviteRes.json();

            const remetenteId = convite.perfil_remetente.jogador.id;

            const destinatarioPerfil = convite.perfil_destinatario;

            showNotification(`Convite ${novoStatus.toLowerCase()} com sucesso!`, 'success');

            const jogador = destinatarioPerfil?.jogador;

            const mensagem = novoStatus === 'Aceito'
                ? `Seu convite foi aceito por ${destinatarioPerfil.nickname}. Discord: ${jogador?.discord}`
                : `Seu convite foi recusado por ${destinatarioPerfil.nickname}.`;

            await fetch('/api/notificacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario_id: remetenteId,
                    mensagem
                }),
            });

            setTimeout(() => location.reload(), 1500);
        } else {
            const data = await res.json();
            showNotification(data.error || 'Não foi possível atualizar o convite', 'error');
        }
    } catch (err) {
        console.error('Erro ao atualizar convite:', err);
        showNotification('Erro de conexão. Tente novamente.', 'error');
    }
};

const carregarNotificacoes = async (usuarioId, container) => {
    try {
        const res = await fetch(`/api/notificacoes/usuario/${usuarioId}`);
        const notificacoes = await res.json();

        if (!Array.isArray(notificacoes) || notificacoes.length === 0) {
            container.innerHTML += '<p>Você não possui notificações.</p>';
            return;
        }

        const notificacoesNaoLidas = notificacoes.filter(notif => !notif.lida);

        if (notificacoesNaoLidas.length === 0) {
            container.innerHTML += '<p>Você não possui notificações.</p>';
            return;
        }

        notificacoesNaoLidas.forEach(notif => {
            const dataFormatada = new Date(notif.data).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo'
            });

            const card = document.createElement('div');
            card.classList.add('publicacao');

            card.innerHTML = `
                <div class="header-publicacao">
                    <div class="autor-perfil">
                        <h2>Notificação</h2>
                    </div>
                </div>

                <div class="publicacao-content">
                    <p>${notif.mensagem}</p>
                </div>

                <div class="footer-convite">
                    <span>${dataFormatada}</span>
                    <label>
                    Lida
                        <input type="checkbox" class="check-lida" data-id="${notif.id}" ${notif.lida ? 'checked' : ''}>
                    </label>
                </div>
            `;

            container.appendChild(card);
        });

        document.querySelectorAll('.check-lida').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const id = e.target.getAttribute('data-id');
                const lida = e.target.checked;

                try {
                    const res = await fetch(`/api/notificacoes/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ lida }),
                    });

                    if (!res.ok) {
                        throw new Error('Erro ao atualizar notificação');
                    }

                    showNotification('Mensagem lida com sucesso!', 'success');
                    setTimeout(() => location.reload(), 1500);
                } catch (err) {
                    console.error('Erro ao marcar notificação como lida:', err);
                }
            });
        });
    } catch (err) {
        console.error('Erro ao carregar notificações:', err);
    }
};