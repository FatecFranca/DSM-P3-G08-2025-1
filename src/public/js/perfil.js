import showNotification from "./notificacao.js";

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

const carregarPerfil = async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token) {
    alert('Você precisa estar logado para acessar essa página.');
    window.location.href = '/login';
    return;
  }

  if (!userId) {
    alert('Usuário não encontrado. Faça login novamente.');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`/api/usuarios/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Não autorizado');
    }

    const usuario = await response.json();

    const main = document.querySelector('main');

    const headerSection = main.querySelector('.profile-header');
    headerSection.innerHTML = `
      <div class="profile-info">
        <div class="profile">
          <img src="${usuario.foto || "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"}">
          <h1>${usuario.nome}</h1>
        </div>
        <div class="profile-actions">
          <button class="cta-button">
            <span class="material-symbols-outlined editarUsuario">edit</span>
          </button>
          <button class="cta-button">
            <span class="material-symbols-outlined logout">logout</span>
          </button>
        </div>
      </div>
      <p>${usuario.discord || 'Sem discord informado.'}</p>
      <p>${usuario.descricao || 'Sem descrição informada.'}</p>
    `;

    document.querySelector('.material-symbols-outlined.logout').addEventListener('click', logout);

    document.querySelector('.material-symbols-outlined.editarUsuario').addEventListener('click', modalEdicaoPerfil);
  }
  catch (error) {
    alert('Sessão expirada ou não autorizada. Faça login novamente.');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

const carregarPerfisDoJogo = async () => {
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/api/usuarios/${userId}/perfis?include=jogo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const perfis = await response.json();
    const container = document.querySelector('.profiles-grid');

    container.innerHTML = '';

    if (!Array.isArray(perfis) || perfis.length === 0) {
      container.innerHTML = `<p>Você ainda não criou nenhum perfil.</p>`;
      return;
    }

    perfis.forEach(perfil => {
      const jogoNome = perfil.jogo?.nome || 'Jogo Desconhecido';
      const backgroundFile = getImageFile(backgroundJogos, jogoNome);
      const logoFile = getImageFile(logos, jogoNome);

      container.innerHTML += `
        <div class="perfil-card" data-id="${perfil.id}">
          <div class="perfil-actions">
            <button class="delete-perfil-btn" title="Excluir Perfil">
              <span class="material-symbols-outlined">delete</span>
            </button>
            <button class="edit-perfil-btn" title="Editar Perfil">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
          <div class="perfil-image">
            <img src="/images/backgrounds/${backgroundFile}" alt="${jogoNome}">
          </div>
          <div class="perfil-content">
            <div class="logoJogo">
              <img src="/images/logos/${logoFile}">
              <h4>${jogoNome}</h4>
            </div>
            <h3>${perfil.nickname}</h3>
            <p class="perfil-description">Personagem favorito: ${perfil.personagem_favorito || 'Não informado'}</p>
            <div class="perfil-meta">
              <div class="skill-level">
                <span>Nível: ${perfil.nivel || 'Não informado'}</span>
              </div>
              <div class="skill-level">
                <span>Frequência: ${perfil.frequencia_joga || 'Não informada'}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    document.querySelectorAll('.delete-perfil-btn').forEach(botao => {
      botao.addEventListener('click', (event) => {
        const perfilId = event.currentTarget.closest('.perfil-card').getAttribute('data-id');
        modalExclusao(perfilId, 'perfil');
      });
    });

    document.querySelectorAll('.edit-perfil-btn').forEach(btn => {
      btn.addEventListener('click', (event) => {
        const perfilId = event.currentTarget.closest('.perfil-card').getAttribute('data-id');
        modalEdicaoPerfilDoJogo(perfilId);
      });
    });

  } catch (error) {
    document.querySelector('.profiles-grid').innerHTML = `<p>Erro ao carregar perfis: ${error.message}</p>`;
  }
}

const carregarPublicacoes = async () => {
  const userId = localStorage.getItem('userId');
  try {
    const response = await fetch(`/api/usuarios/${userId}/perfis?include=publicacoes,jogo,jogador`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const perfis = await response.json();
    const html = document.querySelector('.posts-grid');

    const temPublicacoes = Array.isArray(perfis) && perfis.some(perfil => Array.isArray(perfil.publicacoes) && perfil.publicacoes.length > 0);

    if (!temPublicacoes) {
      html.innerHTML = `<p>Você ainda não criou nenhuma publicação.</p>`;
      return;
    }

    html.innerHTML = '';

    perfis.forEach(perfil => {
      perfil.publicacoes.forEach(publicacao => {
        const jogoNome = perfil.jogo?.nome || 'Jogo Desconhecido';
        const backgroundFile = getImageFile(backgroundJogos, jogoNome);
        const logoFile = getImageFile(logos, jogoNome);

        html.innerHTML += `
          <div class="post-card" data-id="${publicacao.id}">
            <div class="post-actions">
              <button class="delete-btn" title="Excluir Perfil">
                <span class="material-symbols-outlined">delete</span>
              </button>
              <button class="edit-btn" title="Editar Perfil">
                <span class="material-symbols-outlined">edit</span>
              </button>
            </div>
            <div class="post-image">
              <img src="/images/backgrounds/${backgroundFile}" alt="${publicacao.titulo || 'Sem título'}">
            </div>
            <div class="post-content">
              <div class="logoJogo">
                <img src="/images/logos/${logoFile}">
                <h5>${jogoNome}</h5>
              </div>
              <h3>${publicacao.titulo}</h3>
              <p class="post-description">${publicacao.descricao}</p>
              <h4 class="horario">Horário disponível: ${publicacao.horario_disponivel}</h4>
              <div class="post-meta">
                <div class="player-info">
                  <img src="${perfil.jogador.foto || "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"}" alt="${perfil.nickname}">
                  <span>${perfil.nickname}</span>
                </div>
                <div class="skill-level">
                  <span>Nível desejado: ${publicacao.nivel_desejado || 'Não informado'}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    });

    document.querySelectorAll('.delete-btn').forEach(botao => {
      botao.addEventListener('click', (event) => {
        const publicacaoId = event.currentTarget.closest('.post-card').getAttribute('data-id');
        modalExclusao(publicacaoId, 'publicacao');
      });
    });

    document.querySelectorAll('.edit-btn').forEach(botao => {
      botao.addEventListener('click', (event) => {
        const publicacaoId = event.currentTarget.closest('.post-card').getAttribute('data-id');
        modalEdicaoPublicacao(publicacaoId);
      });
    });

  } catch (error) {
    document.querySelector('.posts-grid').innerHTML = `<p>Erro ao carregar publicações: ${error.message}</p>`;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = '/login';
}

const modalCriacaoPerfilDoJogo = () => {
  const createPerfilDoJogo = document.querySelector('.btnCriarPerfilDoJogo');
  const modal = document.getElementById('createPerfilDoJogoModal');
  const closeModal = document.getElementById('closeModal');
  const cancelButton = document.getElementById('cancelButton');

  createPerfilDoJogo.addEventListener('click', function () {
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

const cadastrarPerfilDoJogo = async () => {
  const jogador_id = localStorage.getItem('userId');
  const jogo_id = document.getElementById('gameName').value;
  const nickname = document.getElementById('nickname').value;
  const personagemFavorito = document.getElementById('personagemFavorito').value || null;
  const nivel = document.getElementById('skillLevel').value;
  const frequenciaJoga = document.getElementById('frequenciaJoga').value;

  if (!jogador_id || !jogo_id) {
    showNotification('Usuário ou jogo não selecionado.', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/usuarios/${jogador_id}/perfis`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar perfis existentes');
    }

    const perfis = await response.json();
    const perfilExistente = perfis.find(p => p.jogo_id === jogo_id);

    if (perfilExistente) {
      showNotification('Você já possui um perfil para esse jogo.', 'error');
      return;
    }

    const perfil = {
      jogador_id,
      jogo_id,
      nickname,
      personagem_favorito: personagemFavorito,
      nivel,
      frequencia_joga: frequenciaJoga
    };

    const res = await fetch(`/api/usuarios/${jogador_id}/perfis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfil)
    });

    if (res.ok) {
      document.getElementById('perfilForm').reset();
      document.getElementById('createPerfilDoJogoModal').style.display = 'none';
      document.body.style.overflow = '';
      await carregarPerfisDoJogo();
    } else {
      const err = await res.json();
      showNotification(`${err.message}`, 'error');
    }

  } catch (err) {
    showNotification(`${err.message}`, 'error');
  }
};

const modalExclusao = (id, tipo) => {
  const modalExistente = document.getElementById('confirmDeleteModal');
  if (modalExistente) modalExistente.remove();

  const modalHTML = `
    <div id="confirmDeleteModal" class="modal-overlay" style="display: flex;">
      <div class="modal small-modal">
        <div class="modal-header">
          <h3>Confirmar Exclusão</h3>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir este ${tipo === 'publicacao' ? 'anúncio' : 'perfil de jogo'}?</p>
          <div class="form-actions">
            <button id="cancelDelete" class="btn btn-secondary">Cancelar</button>
            <button id="confirmDelete" class="btn btn-danger">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  document.body.style.overflow = 'hidden';

  const cancelar = document.getElementById('cancelDelete');
  const confirmar = document.getElementById('confirmDelete');

  cancelar.addEventListener('click', () => {
    document.getElementById('confirmDeleteModal').remove();
    document.body.style.overflow = '';
  });

  confirmar.addEventListener('click', async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (tipo === 'perfil') {
        const publicacoes = await buscarPublicacoes();
        console.log('Publicações:', publicacoes);

        const possuiPublicacoes = publicacoes.some(pub => String(pub.perfil_id) === String(id));

        if (possuiPublicacoes) {
          showNotification('Você precisa excluir as publicações associadas a este perfil antes de removê-lo.', 'error');
          return;
        }
      }

      let endpoint = '';

      if (tipo === 'perfil') {
        endpoint = `/api/usuarios/${userId}/perfis/${id}`;
      } else if (tipo === 'publicacao') {
        endpoint = `/api/publicacoes/${id}`;
      } else {
        throw new Error('Tipo de exclusão desconhecido');
      }

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        document.getElementById('confirmDeleteModal').remove();
        document.body.style.overflow = '';

        if (tipo === 'perfil') {
          await carregarPerfisDoJogo();
          showNotification('Perfil excluído com sucesso.', 'success');
        } else {
          await carregarPublicacoes();
          showNotification('Publicação excluída com sucesso.', 'success');
        }
      } else {
        const data = await res.json();

        if (tipo === 'perfil' && data.message?.includes('associado a publicações')) {
          showNotification('Este perfil está associado a uma publicação. Exclua a publicação primeiro.', 'error');
        } else {
          showNotification(data.message || 'Erro ao excluir.', 'error');
        }
      }
    } catch (err) {
      showNotification(`${err.message}`, 'error');
    }
  });
};

const buscarPublicacoes = async () => {
  const userId = localStorage.getItem('userId');
  try {
    const response = await fetch(`/api/usuarios/${userId}/perfis?include=publicacoes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const perfis = await response.json();
    const todasPublicacoes = [];

    perfis.forEach(perfil => {
      if (perfil.publicacoes && perfil.publicacoes.length > 0) {
        perfil.publicacoes.forEach(pub => {
          todasPublicacoes.push({ ...pub, perfil_id: perfil.id });
        });
      }
    });

    return todasPublicacoes;
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    return [];
  }
};

const modalEdicaoPerfilDoJogo = async (perfilId) => {
  const userId = localStorage.getItem('userId');
  let perfil;
  try {
    const res = await fetch(`/api/usuarios/${userId}/perfis/${perfilId}`);
    if (!res.ok) throw new Error('Erro ao carregar perfil');
    perfil = await res.json();
  } catch (err) {
    showNotification(`${err.message}`, 'error');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';

  const modal = document.createElement('div');
  modal.className = 'modal';

  modal.innerHTML = `
    <div class="modal-header">
      <span>Editar Perfil do Jogo</span>
      <button class="close-btn" id="cancelEditPerfil">&times;</button>
    </div>
    <div class="modal-body">
      <form id="editPerfilForm">
        <div class="form-group">
          <label for="edit-nickname">Nickname*</label>
          <input type="text" id="edit-nickname" required>
        </div>

        <div class="form-group">
          <label for="edit-personagemFavorito">Personagem Favorito</label>
          <input type="text" id="edit-personagemFavorito">
        </div>

        <div class="form-group">
          <label for="edit-skillLevel">Nível de Habilidade*</label>
          <select id="edit-skillLevel" required>
            <option value="">Selecione um nível</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
            <option value="Profissional">Profissional</option>
          </select>
        </div>

        <div class="form-group">
          <label for="edit-frequenciaJoga">Frequência de Jogo*</label>
          <select id="edit-frequenciaJoga" required>
            <option value="">Selecione a frequência</option>
            <option value="Diariamente">Diariamente</option>
            <option value="Algumas vezes por semana">Algumas vezes por semana</option>
            <option value="Fins de semana">Fins de semana</option>
            <option value="Raramente">Raramente</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" id="cancelEditPerfilFooter">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('edit-nickname').value = perfil.nickname;
  document.getElementById('edit-personagemFavorito').value = perfil.personagem_favorito || '';
  document.getElementById('edit-skillLevel').value = perfil.nivel || '';
  document.getElementById('edit-frequenciaJoga').value = perfil.frequencia_joga || '';

  document.getElementById('cancelEditPerfil').addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = '';
  });

  document.getElementById('cancelEditPerfilFooter').addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = '';
  });

  document.getElementById('editPerfilForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
      nickname: document.getElementById('edit-nickname').value,
      personagem_favorito: document.getElementById('edit-personagemFavorito').value || null,
      nivel: document.getElementById('edit-skillLevel').value,
      frequencia_joga: document.getElementById('edit-frequenciaJoga').value
    };

    try {
      const res = await fetch(`/api/usuarios/${userId}/perfis/${perfilId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error('Erro ao atualizar perfil');

      showNotification('Perfil atualizado com sucesso!', 'success');
      document.body.removeChild(overlay);
      document.body.style.overflow = '';

      carregarPerfisDoJogo();
    } catch (err) {
      showNotification(`${err.message}`, 'error');
    }
  });
};

const modalEdicaoPublicacao = async (publicacaoId) => {
  try {
    const res = await fetch(`/api/publicacoes/${publicacaoId}`);
    if (!res.ok) throw new Error('Erro ao carregar publicação');
    const publicacao = await res.json();

    const modalExistente = document.getElementById('editPostModal');
    if (modalExistente) modalExistente.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'editPostModal';
    overlay.style.display = 'flex';

    overlay.innerHTML = `
      <div id="notification" class="notification hidden"></div>
      <div class="modal">
        <div class="modal-header">
          <h3>Editar Anúncio</h3>
          <button class="close-btn" id="closeEditPost">&times;</button>
        </div>
        <div class="modal-body">
          <form id="editPostForm">
            <div class="form-group">
              <label for="edit-postTitle">Título do Anúncio*</label>
              <input type="text" id="edit-postTitle" required>
            </div>

            <div class="form-group">
              <label for="edit-skillLevel">Nível de Habilidade Desejado*</label>
              <select id="edit-skillLevel" required>
                <option value="">Selecione um nível</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Profissional">Profissional</option>
              </select>
            </div>

            <div class="form-group">
              <label for="edit-timeAvailable">Horário Disponível*</label>
              <select id="edit-timeAvailable" required>
                <option value="">Selecione um horário</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Madrugada">Madrugada</option>
                <option value="Flexível">Flexível</option>
              </select>
            </div>

            <div class="form-group">
              <label for="edit-postDescription">Descrição*</label>
              <textarea id="edit-postDescription" rows="4" required></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="cancelEditPost">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    document.getElementById('edit-postTitle').value = publicacao.titulo;
    document.getElementById('edit-skillLevel').value = publicacao.nivel_desejado;
    document.getElementById('edit-timeAvailable').value = publicacao.horario_disponivel;
    document.getElementById('edit-postDescription').value = publicacao.descricao;

    document.getElementById('closeEditPost').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });

    document.getElementById('cancelEditPost').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });

    document.getElementById('editPostForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const dadosAtualizados = {
        titulo: document.getElementById('edit-postTitle').value,
        nivel_desejado: document.getElementById('edit-skillLevel').value,
        horario_disponivel: document.getElementById('edit-timeAvailable').value,
        descricao: document.getElementById('edit-postDescription').value
      };

      try {
        const res = await fetch(`/api/publicacoes/${publicacaoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dadosAtualizados)
        });

        if (!res.ok) throw new Error('Erro ao atualizar publicação');

        showNotification('Anúncio atualizado com sucesso!', 'success');
        overlay.remove();
        document.body.style.overflow = '';
        carregarPublicacoes();
      } catch (err) {
        showNotification(err.message, 'error');
      }
    });

  } catch (err) {
    showNotification(err.message, 'error');
  }
};

const modalEdicaoPerfil = async () => {
  const userId = localStorage.getItem('userId');

  try {
    const res = await fetch(`/api/usuarios/${userId}`);
    if (!res.ok) throw new Error('Erro ao carregar dados do usuário');

    const usuario = await res.json();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.display = 'flex';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-header">
        <span>Editar Perfil</span>
        <button class="close-btn" id="closeEditPerfil">&times;</button>
      </div>
      <div class="modal-body">
        <form id="editUserForm">
          <div class="form-group">
            <label for="edit-nome">Nome</label>
            <input type="text" id="edit-nome" required value="${usuario.nome}">
          </div>

          <div class="form-group">
            <label for="edit-discord">Discord</label>
            <input type="text" id="edit-discord" required value="${usuario.discord || ''}">
          </div>

          <div class="form-group">
            <label for="edit-descricao">Descrição</label>
            <textarea id="edit-descricao" rows="3">${usuario.descricao || ''}</textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" id="cancelEditUser">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    document.getElementById('closeEditPerfil').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });

    document.getElementById('cancelEditUser').addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });

    document.getElementById('editUserForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('edit-nome').value.trim();
      const discord = document.getElementById('edit-discord').value.trim();
      const descricao = document.getElementById('edit-descricao').value.trim();

      try {
        const res = await fetch(`/api/usuarios/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, discord, descricao })
        });

        if (!res.ok) throw new Error('Erro ao atualizar perfil');

        showNotification('Perfil atualizado com sucesso!', 'success');
        overlay.remove();
        document.body.style.overflow = '';

        carregarPerfil();

      } catch (err) {
        showNotification(err.message, 'error');
      }
    });

  } catch (err) {
    showNotification(err.message, 'error');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
  carregarPerfisDoJogo();
  carregarPublicacoes();
});

document.getElementById('perfilForm').addEventListener('submit', (e) => {
  e.preventDefault();
  cadastrarPerfilDoJogo();
});

document.querySelector('.btnCriarPerfilDoJogo').addEventListener('click', modalCriacaoPerfilDoJogo());