import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'

const controller = {};

controller.create = async function (req, res) {
    try {
        const { perfil_remetente_id, perfil_destinatario_id } = req.body;

        if (!perfil_remetente_id || !perfil_destinatario_id) {
            return res.status(400).json({ error: 'perfil_remetente_id, perfil_destinatario_id são obrigatórios' });
        }

        if (perfil_remetente_id === perfil_destinatario_id) {
            return res.status(400).json({ error: 'Você não pode enviar um convite para si mesmo.' });
        }

        const remetenteExiste = await prisma.perfilDoJogo.findUnique({
            where: { id: perfil_remetente_id }
        });
        const destinatarioExiste = await prisma.perfilDoJogo.findUnique({
            where: { id: perfil_destinatario_id }
        });

        if (!remetenteExiste || !destinatarioExiste) {
            return res.status(404).json({ error: 'Usuário remetente ou destinatário não encontrado.' });
        }

        const conviteExistente = await prisma.convite.findFirst({
            where: {
                perfil_remetente_id,
                perfil_destinatario_id,
                status: 'Pendente'
            }
        });

        if (conviteExistente) {
            return res.status(409).json({ error: 'Convite já enviado e ainda pendente.' });
        }

        const convite = await prisma.convite.create({
            data: {
                perfil_remetente_id,
                perfil_destinatario_id,
                status: 'Pendente',
                data_envio: new Date()
            },
        });

        res.status(201).json(convite);
    } catch (err) {
        console.error('Erro ao criar convite:', err);
        res.status(500).json({ error: 'Erro interno ao criar convite', details: err.message });
    }
};

controller.retrieveOne = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['perfil_remetente', 'perfil_destinatario', 'perfil_remetente.jogador', 'perfil_destinatario.jogador']);

        const convite = await prisma.convite.findUnique({
            include,
            where: { id: req.params.id },
        });
        if (!convite) return res.status(404).json({ message: 'Convite não encontrado' });

        res.json(convite);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

controller.retrieveAll = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['perfil_remetente', 'perfil_destinatario']);

        const result = await prisma.convite.findMany({
            include,
            orderBy: [{ data_envio: 'asc' }],
        });

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

controller.getPendentesPorUsuario = async function (req, res) {
    const { usuarioId } = req.params;

    try {
        const perfis = await prisma.perfilDoJogo.findMany({
            where: { jogador_id: usuarioId },
            select: { id: true }
        });

        const perfilIds = perfis.map(p => p.id);

        const convites = await prisma.convite.findMany({
            where: {
                perfil_destinatario_id: { in: perfilIds },
                status: 'Pendente',
            }
        });

        res.status(200).json(convites);
    } catch (error) {
        console.error('Erro ao buscar convites pendentes:', error);
        res.status(500).json({ error: 'Erro ao buscar convites' });
    }
};

controller.getPendentesDetalhados = async function (req, res) {
    const { usuarioId } = req.params;

    try {
        const perfis = await prisma.perfilDoJogo.findMany({
            where: { jogador_id: usuarioId },
            select: { id: true }
        });

        const perfilIds = perfis.map(p => p.id);

        const convites = await prisma.convite.findMany({
            where: {
                perfil_destinatario_id: { in: perfilIds },
                status: 'Pendente'
            },
            include: {
                perfil_remetente: {
                    include: {
                        jogo: true,
                        jogador: true
                    }
                }
            },
            orderBy: {
                data_envio: 'desc'
            }
        });

        res.status(200).json(convites);
    } catch (error) {
        console.error('Erro ao buscar convites detalhados:', error);
        res.status(500).json({ error: 'Erro ao buscar convites pendentes com detalhes' });
    }
};

controller.update = async function (req, res) {
    try {
        const status = req.body.status;

        await prisma.convite.update({
            where: { id: req.params.id },
            data: { status }
        });

        res.status(204).end();
    } catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end();
        } else {
            console.error(error);
            res.status(500).send(error);
        }
    }
};

controller.delete = async function (req, res) {
    try {
        await prisma.convite.delete({
            where: { id: req.params.id },
        });

        res.status(204).end();
    } catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end();
        } else {
            console.error(error);
            res.status(500).send(error);
        }
    }
};

export default controller;