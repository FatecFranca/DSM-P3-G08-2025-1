import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path'

import viewRouter from './routes/viewRoutes.js'
import usuarioRouter from './routes/usuarioRoutes.js'
import jogoRoutes from './routes/jogoRoutes.js';

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/usuarios', usuarioRouter)
app.use('/api/jogos', jogoRoutes)

app.use('/', viewRouter)

app.use(express.static(path.resolve('./src/public')))

export default app