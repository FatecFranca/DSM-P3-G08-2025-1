import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'
import bcrypt from 'bcryptjs';

const controller = {}

controller.create = async function (req, res) {
    try {
        const { nome, email, senha } = req.body

        const senhaHash = await bcrypt.hash(senha, 10)

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash
            }
        })

        const { id, nome: nomeRetornado, email: emailRetornado } = novoUsuario;

        res.status(201).json({ id, nome: nomeRetornado, email: emailRetornado });
    } catch (error) {
        console.error(error)

        res.status(500).send(error)
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const result = await prisma.usuario.findUnique({
            where: { id: req.params.id }
        })

        if (result) res.send(result)

        else res.status(404).end()
    }
    catch (error) {
        console.error(error)

        res.status(500).send(error)
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['perfis', 'jogo']);

        console.log(include)

        const result = await prisma.usuario.findMany({
            include,
            orderBy: [{ nome: 'asc' }]
        })

        res.send(result)
    } catch (error) {
        console.error(error)

        res.status(500).send(error)
    }
};

controller.update = async function (req, res) {
    try {
        await prisma.usuario.update({
            where: { id: req.params.id },
            data: req.body
        })

        res.status(204).end()
    } catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end()
        }
        else {
            console.error(error)

            res.status(500).send(error)
        }
    }
}

controller.delete = async function (req, res) {
    try {
        await prisma.usuario.delete({
            where: { id: req.params.id }
        })

        res.status(204).end()
    }
    catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end()
        }
        else {
            console.error(error)

            res.status(500).send(error)
        }
    }
}

/*----------------------------------------------------------------*/

controller.createPerfil = async function (req, res) {
    try {
        req.body.jogador_id = req.params.id

        await prisma.perfilDoJogo.create({ data: req.body })

        res.status(201).end()
    }
    catch (error) {
        console.error(error)

        res.status(500).send(error)
    }
}

controller.retrieveAllPerfis = async function (req, res) {
    try {
        const include = includeRelations(req.query, ['jogador', 'jogo']);

        const result = await prisma.perfilDoJogo.findMany({
            where: { jogador_id: req.params.id },
            orderBy: [{ nickname: 'asc' }],
            include
        })

        res.send(result)
    }
    catch (error) {
        console.error(error)

        res.status(500).send(error)
    }
}

controller.retrieveOnePerfil = async function (req, res) {
    try {
        const result = await prisma.perfilDoJogo.findFirst({
            where: {
                id: req.params.perfilId,
                jogador_id: req.params.id
            }
        })

        if (result) res.send(result)
        else res.status(404).end()
    }
    catch (error) {
        console.error(error)

        res.status(500).send(error)
    }
}

controller.updatePerfil = async function (req, res) {
    try {
        await prisma.perfilDoJogo.update({
            where: {
                id: req.params.perfilId,
                pedido_id: req.params.id
            },
            data: req.body
        })

        res.status(204).end()

    }
    catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end()
        }
        else {
            console.error(error)

            res.status(500).send(error)
        }
    }
}

controller.deletePerfil = async function (req, res) {
    try {
        await prisma.perfilDoJogo.delete({
            where: {
                id: req.params.perfilId,
                pedido_id: req.params.id
            }
        })

        res.status(204).end()
    }
    catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end()
        }
        else {
            console.error(error)

            res.status(500).send(error)
        }
    }
}

export default controller