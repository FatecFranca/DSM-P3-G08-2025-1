import express from 'express'
import controller from '../controllers/usuarioController.js'

const router = express.Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

// Rotas para os perfis do usuário

router.post('/:id/perfis', controller.createPerfil)
router.get('/:id/perfis', controller.retrieveAllPerfis)
router.get('/:id/perfis/:perfilId', controller.retrieveOnePerfil)
router.put('/:id/perfis/:perfilId', controller.updatePerfil)
router.delete('/:id/perfis/:perfilId', controller.deletePerfil)

export default router