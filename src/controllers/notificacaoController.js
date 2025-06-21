import prisma from '../database/client.js';

const controller = {};

controller.create = async function (req, res) {
  try {
    const { usuario_id, mensagem } = req.body;
    if (!usuario_id || !mensagem) {
      return res.status(400).json({ error: 'usuario_id e mensagem são obrigatórios' });
    }

    const notificacao = await prisma.notificacao.create({
      data: { usuario_id, mensagem },
    });

    res.status(201).json(notificacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.retrieveByUsuario = async function (req, res) {
  try {
    const usuarioId = req.params.usuarioId;

    const notificacoes = await prisma.notificacao.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { data: 'desc' },
    });

    res.status(200).json(notificacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const notificacao = await prisma.notificacao.findUnique({
      where: { id: req.params.id },
    });

    if (!notificacao) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    res.json(notificacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

controller.update = async function (req, res) {
  try {
    const { lida } = req.body;

    await prisma.notificacao.update({
      where: { id: req.params.id },
      data: { lida },
    });
    
    res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end();
    } else {
      res.status(500).json({ error: 'Erro ao atualizar notificação' });
    }
  }
};

controller.delete = async function (req, res) {
  try {
    await prisma.notificacao.delete({
      where: { id: req.params.id },
    });
    res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      res.status(404).end();
    } else {
      res.status(500).json({ error: 'Erro ao deletar notificação' });
    }
  }
};

export default controller;