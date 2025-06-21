import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import viewRoutes from './routes/viewRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import conviteRoutes from './routes/conviteRoutes.js';
import publicacaoRoutes from './routes/publicacaoRoutes.js';
import jogoRoutes from './routes/jogoRoutes.js';
import notificacaoRoutes from './routes/notificacaoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(cors({
    origin: 'http://localhost:8080',
}));
app.use(express.json());
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/usuarios', usuarioRoutes)
app.use('/api/convites', conviteRoutes)
app.use('/api/publicacoes', publicacaoRoutes)
app.use('/api/jogos', jogoRoutes)
app.use('/api/notificacoes', notificacaoRoutes)

app.use('/', viewRoutes)

app.use(express.static(path.resolve('./src/public')))
app.use('/uploads', express.static(path.resolve('src/uploads')));

app.get('/publicacoes/:id', (req, res) => {
  res.sendFile(resolve(__dirname, 'views', 'publicacao.html'));
});

app.get('/notificacoes', (req, res) => {
  res.sendFile(resolve(__dirname, 'views', 'notificacoes.html'));
});

export default app