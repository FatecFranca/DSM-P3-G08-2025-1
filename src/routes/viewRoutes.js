import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/index.html'))
})

router.get('/times', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/times.html'))
})

router.get('/jogadores', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/jogadores.html'))
})

router.get('/perfil', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/usuario/perfil.html'))
})

router.get('/cadastro', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/usuario/cadastro.html'))
})

router.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/usuario/login.html'))
})

router.get('/sobre', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/sobre.html'))
})

router.get('/contato', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../views/sobre.html'))
})

export default router