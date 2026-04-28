import { Router } from 'express';
import { PagoController } from './pago.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreatePagoSchema } from './pago.dto.js';

export function createPagoRouter(controller: PagoController): Router {
  const router = Router();
  router.post('/',    authenticate, validateBody(CreatePagoSchema), controller.crear);
  router.get('/',     authenticate, requireAdmin, controller.listAll);
  router.get('/:id',  authenticate, controller.getById);
  return router;
}
