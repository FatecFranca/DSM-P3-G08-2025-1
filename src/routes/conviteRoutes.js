import express from 'express';
const router = express.Router();
import controller from '../controllers/conviteController.js';

router.post('/', controller.create);
router.get('/:id', controller.retrieveOne);
router.get('/', controller.retrieveAll);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.get('/pendentes/:usuarioId', controller.getPendentesPorUsuario);
router.get('/pendentes-detalhados/:usuarioId', controller.getPendentesDetalhados);

export default router;