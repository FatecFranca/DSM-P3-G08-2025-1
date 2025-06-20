document.addEventListener('DOMContentLoaded', async () => {
    const main = document.querySelector('.main-content');
    const urlParams = new URLSearchParams(window.location.pathname.split('/').pop());
    const publicacaoId = window.location.pathname.split('/').pop();

    try {
        const res = await fetch(`/api/publicacoes/${publicacaoId}?include=perfil,autor`);
        if (!res.ok) throw new Error('Erro ao carregar publicação');
        const publicacao = await res.json();

        const perfil = publicacao.perfil || {};
        const autor = publicacao.autor || {};
        const jogoNome = perfil.jogo?.nome || 'Jogo Desconhecido';

        const logos = {
            'league of legends': 'lol.png',
            'valorant': 'valorant.jpg',
            'dota 2': 'dota2.png',
            'counter strike 2': 'cs.png',
            'apex legends': 'apex.png',
            'fortnite': 'fortnite.png',
            'overwatch 2': 'overwatch2.png',
        };

        const logo = logos[jogoNome.toLowerCase()] || 'default.png';

        main.innerHTML = `
        <button class="btn-voltar" onclick="window.history.back()">
            <span class="material-symbols-outlined">arrow_back</span>
        </button>

        <div class="publicacao">
            <div class="header-publicacao">
                <div class="autor-perfil">
                    <img src="${autor.foto || 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg'}" alt="${perfil.nickname}">
                    <h2>${perfil.nickname}</h2>
                </div>
                <div class="detalhes-perfil">
                    <div class="logoJogo">
                        <img src="/images/logos/${logo}">
                        <h4>${jogoNome}</h4>
                    </div>
                    <p>Nível: ${perfil.nivel}</p>
                </div>
            </div>
            <p class="descricao-perfil">${publicacao.autor.descricao || 'Descrição não informada'}</p>
            <div class="publicacao-content">
                <h3>${publicacao.titulo}</h3>
                <p>${publicacao.descricao}</p>
                <p>Personagem favorito: ${publicacao.perfil.personagem_favorito}</p>
                <p>Frequência: ${publicacao.perfil.frequencia_joga}</p>
                <p>Horário disponível: ${publicacao.horario_disponivel}</p>
            </div>
            <div class="footer-publicacao">
            <p>Nível desejado: ${publicacao.nivel_desejado}</p>
            <button class="enviar-convite">Enviar convite</button>
            </div>
        </div>
    `;
    } catch (err) {
        main.innerHTML = `<p class="error">Erro ao carregar publicação: ${err.message}</p>`;
    }
});