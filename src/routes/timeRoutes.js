import express from 'express';
const router = express.Router();
import controller from '../controllers/timeController.js';

router.post('/', controller.create);
router.get('/:id', controller.retrieveOne);
router.get('/', controller.retrieveAll);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

router.post('/:id/integrantes', controller.createIntegrante)
router.get('/:id/integrantes', controller.retrieveAllIntegrantes)
router.get('/:id/integrantes/:integranteId', controller.retrieveOneIntegrante)
router.put('/:id/integrantes/:integranteId', controller.updateIntegrante)
router.delete('/:id/integrantes/:integranteId', controller.deleteIntegrante)

export default router;