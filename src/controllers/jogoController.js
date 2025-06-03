import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'

const controller = {};

controller.create = async function (req, res) {
    try {
        const { nome, genero } = req.body;
        const jogo = await prisma.jogo.create({
            data: { nome, genero },
        });
        res.status(201).json(jogo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

controller.retrieveOne = async function (req, res) {
    try {
        const jogo = await prisma.jogo.findUnique({
            where: { id: req.params.id },
        });
        if (!jogo) return res.status(404).json({ message: 'Jogo não encontrado' });
        res.json(jogo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

controller.retrieveAll = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['perfis']);
        console.log(include);

        const result = await prisma.jogo.findMany({
            include,
            orderBy: [{ nome: 'asc' }],
        });

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

controller.update = async function (req, res) {
    try {
        await prisma.jogo.update({
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
        await prisma.jogo.delete({
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