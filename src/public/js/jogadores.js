import showNotification from "./showNotification.js";

const backgroundJogos = {
  'apex legends': 'apex_bg.jpg',
  'counter strike 2': 'cs_bg.jpg',
  'dota 2': 'dota2_bg.jpg',
  'fortnite': 'fortnite_bg.jpg',
  'league of legends': 'lol_bg.jpg',
  'overwatch 2': 'overwatch2_bg.jpg',
  'valorant': 'valorant_bg.jpg'
};

const logos = {
  'apex legends': 'apex.png',
  'counter strike 2': 'cs.png',
  'dota 2': 'dota2.png',
  'fortnite': 'fortnite.png',
  'league of legends': 'lol.png',
  'overwatch 2': 'overwatch2.png',
  'valorant': 'valorant.jpg'
}

const getImageFile = (map, gameName) => {
  const normalizedGameName = gameName.toLowerCase();
  return map[normalizedGameName] || map['default'] || 'default.png';
};

const carregarPublicacoes = async () => {
  try {
    const response = await fetch('/api/publicacoes?include=perfil,autor', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const publicacoes = await response.json();
    const html = document.querySelector('.posts-grid');

    html.innerHTML = '';

    publicacoes.forEach(publicacao => {
      const jogoNome = publicacao.perfil?.jogo?.nome || 'Jogo Desconhecido';
      const backgroundFile = getImageFile(backgroundJogos, jogoNome);
      const logoFile = getImageFile(logos, jogoNome);
      html.innerHTML += `
          <a href="/publicacoes/${publicacao.id}" class="post-card-link">
            <div class="post-card">
              <div class="post-image">
                <img src="/images/backgrounds/${backgroundFile}" alt="${publicacao.titulo}">
              </div>
              <div class="post-content">
                <div class="logoJogo">
                    <img src="/images/logos/${logoFile}">
                    <h4>${jogoNome}</h4>
                </div>
                <h3>${publicacao.titulo}</h3>
                <p class="post-description">${publicacao.descricao}</p>
                <h4 class="horario">Horário disponível: ${publicacao.horario_disponivel}</h4>
                <div class="post-meta">
                  <div class="player-info">
                    <img src="${publicacao.autor.foto || "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"}" alt="${publicacao.perfil.nickname}">
                    <span>${publicacao.perfil.nickname}</span>
                  </div>
                  <div class="skill-level">
                    <span>Nível desejado: ${publicacao.nivel_desejado}</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
          `;
    });
  } catch (error) {
    document.querySelector('.posts-grid').innerHTML = `<p>Erro ao carregar publicações: ${error.message}</p>`;
  }
}

const modal = () => {
  const createPostBtn = document.getElementById('createPostBtn');
  const modal = document.getElementById('createPostModal');
  const closeModal = document.getElementById('closeModal');
  const cancelButton = document.getElementById('cancelButton');

  createPostBtn.addEventListener('click', function () {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  function fecharModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeModal.addEventListener('click', fecharModal);
  cancelButton.addEventListener('click', fecharModal);

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      fecharModal();
    }
  });
};

const carregarPerfilDoJogoSelecionado = async () => {
  const jogador_id = localStorage.getItem('userId');
  const jogo_id = document.getElementById('gameName').value;

  if (!jogador_id || !jogo_id) return;

  try {
    const response = await fetch(`/api/usuarios/${jogador_id}/perfis`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const perfis = await response.json();

    const perfil = perfis.find(p => p.jogo_id === jogo_id);

    const perfilContainer = document.getElementById('perfilInfoContainer');
    const perfilDiv = document.getElementById('perfilInfo');

    if (perfil) {
      perfilContainer.style.display = 'block';
      perfilDiv.innerHTML = `
        <div class="form-group">
          <div id="perfilInfo" class="select-simulacao">${perfil.nickname}</div>
        </div>
      `;
      perfilDiv.dataset.perfilId = perfil.id;
    } else {
      perfilContainer.style.display = 'block';
      perfilDiv.innerHTML = `<p>Você ainda não criou um perfil para esse jogo.</p>`;
      perfilDiv.style.color = "red";
      perfilDiv.dataset.perfilId = '';
    }

  } catch (err) {
    console.error('Erro ao carregar perfil:', err.message);
  }
};

const cadastrarPublicacao = async () => {
  const perfil_id = document.querySelector('#perfilInfo')?.dataset?.perfilId;
  const autor_id = localStorage.getItem('userId');
  const titulo = document.getElementById('postTitle').value;
  const descricao = document.getElementById('postDescription').value;
  const nivel_desejado = document.getElementById('skillLevel').value;
  const horario_disponivel = document.getElementById('timeAvailable').value;

  if (!perfil_id || !autor_id || !titulo || !descricao || !nivel_desejado || !horario_disponivel) {
    showNotification('Preencha todos os campos obrigatórios e certifique-se de ter um perfil no jogo selecionado.', 'error');
    return;
  }

  try {
    const publicacao = { perfil_id, autor_id, titulo, descricao, nivel_desejado, horario_disponivel };

    const res = await fetch(`/api/publicacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publicacao)
    });

    if (res.ok) {
      document.getElementById('postForm').reset();
      document.getElementById('createPostModal').style.display = 'none';
      document.body.style.overflow = '';
      await carregarPublicacoes();
      showNotification('Anúncio publicado com sucesso!', 'success');
    } else {
      const err = await res.json();
      showNotification(`Erro ao publicar: ${err.message}`, 'error');
    }

  } catch (error) {
    showNotification(`Erro: ${error.message}`, 'error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  carregarPublicacoes();
});

document.getElementById('createPostBtn').addEventListener('click', () => {
  if (localStorage.getItem('userId') !== null) modal();
  else {
    showNotification('Você precisa estar logado para criar uma publicação!', 'error');
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  };
});

document.getElementById('gameName').addEventListener('change', carregarPerfilDoJogoSelecionado);

document.getElementById('submitButton').addEventListener('click', async (e) => {
  e.preventDefault();
  cadastrarPublicacao();
});

document.querySelector('.notification-btn').addEventListener('click', () => {
  window.location.href = '/notificacoes';
});