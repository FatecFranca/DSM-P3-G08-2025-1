import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'

const controller = {};

controller.create = async function (req, res) {
    try {
        const { remetente_id, destinatario_id, status, data_envio, time_id } = req.body;

        if (!remetente_id || !destinatario_id || !status) {
            return res.status(400).json({ error: 'remetente_id, destinatario_id e status são obrigatórios' });
        }

        const remetenteExiste = await prisma.usuario.findUnique({ where: { id: remetente_id } });
        const destinatarioExiste = await prisma.usuario.findUnique({ where: { id: destinatario_id } });
        if (!remetenteExiste || !destinatarioExiste) {
            return res.status(400).json({ error: 'Um ou ambos os usuários não existem' });
        }

        const dataEnvioFinal = data_envio ? new Date(data_envio) : new Date();

        const convite = await prisma.convite.create({
            data: {
                remetente_id,
                destinatario_id,
                status,
                data_envio: dataEnvioFinal,
                time_id
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
        const convite = await prisma.convite.findUnique({
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
        const include = includeRelations(req.query, ['remetente']);
        console.log(include);

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

controller.update = async function (req, res) {
    try {
        await prisma.convite.update({
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