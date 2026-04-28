import { Router } from 'express';
import { DevolucionController } from './devolucion.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateDevolucionSchema } from './devolucion.dto.js';

export function createDevolucionRouter(controller: DevolucionController): Router {
  const router = Router();
  router.post('/',    authenticate, requireAdmin, validateBody(CreateDevolucionSchema), controller.registrar);
  router.get('/',     authenticate, requireAdmin, controller.listAll);
  router.get('/:id',  authenticate, requireAdmin, controller.getById);
  return router;
}
