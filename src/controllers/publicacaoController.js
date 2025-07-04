import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'

const controller = {};

controller.create = async function (req, res) {
    try {
        const { titulo, autor_id, perfil_id, descricao, horario_disponivel, nivel_desejado, data_criacao } = req.body;

        const autor = await prisma.usuario.findUnique({
            where: { id: autor_id },
            select: { discord: true }
        });

        if (!autor || !autor.discord || autor.discord.trim() === '') {
            return res.status(400).json({
                error: 'Você precisa cadastrar seu Discord antes de criar uma publicação.'
            });
        }

        const publicacao = await prisma.publicacao.create({
            data: {
                titulo,
                autor_id,
                perfil_id,
                descricao,
                horario_disponivel,
                nivel_desejado,
                data_criacao: new Date()
            },
        });

        res.status(201).json(publicacao);
    } catch (err) {
        console.error('Erro ao criar publicacao:', err);
        res.status(500).json({ error: 'Erro interno ao criar publicacao', details: err.message });
    }
};

controller.retrieveOne = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['autor', 'perfil']);
        include.perfil = { ...include.perfil, include: { jogo: true } } || { include: { jogo: true } };

        const publicacao = await prisma.publicacao.findUnique({
            include,
            where: { id: req.params.id },
        });
        if (!publicacao) return res.status(404).json({ message: 'Publicação não encontrada' });
        res.json(publicacao);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

controller.retrieveAll = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['autor', 'perfil']);
        include.perfil = { ...include.perfil, include: { jogo: true } } || { include: { jogo: true } };

        const publicacoes = await prisma.publicacao.findMany({
            include,
            orderBy: [{ data_criacao: 'desc' }],
        });

        res.send(publicacoes);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

controller.update = async function (req, res) {
    try {
        await prisma.publicacao.update({
            where: { id: req.params.id },
            data: req.body,
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
        await prisma.publicacao.delete({
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