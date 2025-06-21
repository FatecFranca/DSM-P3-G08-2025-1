import prisma from '../database/client.js';
import { includeRelations } from '../lib/utils.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const controller = {};

controller.create = async function (req, res) {
    try {
        const { nome, email, senha, foto } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Os campos nome, email e senha são obrigatórios' });
        }
        if (typeof nome !== 'string' || nome.trim() === '') {
            return res.status(400).json({ error: 'Nome inválido' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }
        if (senha.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        let fotoPath = null;
        if (foto) {
            const base64Data = foto.replace(/^data:image\/\w+;base64,/, '');
            const filename = `${Date.now()}.png`;
            const uploadDir = path.join(__dirname, '../uploads');

            try {
                await fs.access(uploadDir);
            } catch {
                await fs.mkdir(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, filename);
            await fs.writeFile(filePath, base64Data, 'base64');

            fotoPath = `/uploads/${filename}`;
        }

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome: nome.trim(),
                email: email.trim(),
                senha: senhaHash,
                foto: fotoPath,
            },
        });

        res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            foto: novoUsuario.foto,
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        res.status(500).json({ error: 'Erro interno ao criar usuário', details: error.message });
    }
};

controller.login = async function (req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    return res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      foto: usuario.foto,
      perfis: usuario.perfis
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
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
        const include = includeRelations(req.query, ['jogador', 'jogo', 'publicacoes']);

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
        const include = includeRelations(req.query, ['jogador', 'jogo', 'publicacoes']);

        const result = await prisma.perfilDoJogo.findFirst({
            where: {
                id: req.params.perfilId,
                jogador_id: req.params.id,
            },
            include
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
                jogador_id: req.params.id
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
                jogador_id: req.params.id
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