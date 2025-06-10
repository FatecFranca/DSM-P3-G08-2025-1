import prisma from '../database/client.js';
import { includeRelations } from '../lib/utils.js';

const controller = {};


controller.create = async function (req, res) {
    try {
        const { nome, jogo_id, criador_id, data_criacao, jogo, criador } = req.body;
        const dataCriacao = data_criacao ? new Date(data_criacao) : new Date();

        const time = await prisma.time.create({
            data: {
                nome,
                jogo_id,
                criador_id,
                jogo,
                criador,
                data_criacao: dataCriacao,
            },
        });

        res.status(201).json(time);
    } catch (err) {
        console.error('Erro ao criar time:', err);
        res.status(500).json({ error: 'Erro interno ao criar time', details: err.message });
    }
};

controller.retrieveOne = async function (req, res) {
    try {
        const time = await prisma.time.findUnique({
            where: { id: req.params.id },
        });

        if (!time) return res.status(404).json({ message: 'Time não encontrado' });

        res.json(time);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

controller.retrieveAll = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['criador']);
        console.log(include);

        const result = await prisma.time.findMany({
            include,
            orderBy: [{ data_criacao: 'asc' }],
        });

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

controller.update = async function (req, res) {
    try {
        await prisma.time.update({
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
        await prisma.time.delete({
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

/*--------------------------------------------------------*/

controller.createIntegrante = async function (req, res) {
    try {
        const { time_id, perfil_id, time, perfil } = req.body;

        const timeIntegrante = await prisma.timeIntegrante.create({
            data: {
                time_id,
                perfil_id,
                time,
                perfil,
            },
        });

        res.status(201).json(timeIntegrante);
    } catch (err) {
        console.error('Erro ao adicionar integrante do time:', err);
        res.status(500).json({ error: 'Erro interno ao adicionar integrante do time', details: err.message });
    }
};

controller.retrieveOneIntegrante = async function (req, res) {
    try {
        const timeIntegrante = await prisma.timeIntegrante.findUnique({
            where: {
                id: req.params.integranteId,
            },
        });

        if (timeIntegrante) res.send(timeIntegrante)
        else res.status(404).end()

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

controller.retrieveAllIntegrantes = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['perfil', 'time']);
        console.log(include);

        const result = await prisma.timeIntegrante.findMany({
            include,
            orderBy: [{ id: 'asc' }],
        });

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

controller.updateIntegrante = async function (req, res) {
    try {
        await prisma.timeIntegrante.update({
            where: { id: req.params.integranteId  },
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

controller.deleteIntegrante = async function (req, res) {
    try {
        await prisma.timeIntegrante.delete({
            where: { id: req.params.integranteId },
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
