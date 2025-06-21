import express from 'express';
const router = express.Router();
import controller from '../controllers/notificacaoController.js';

router.post('/', controller.create);
router.get('/usuario/:usuarioId', controller.retrieveByUsuario);
router.get('/:id', controller.retrieveOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;