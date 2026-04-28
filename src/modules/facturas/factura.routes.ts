import { Router } from 'express';
import { FacturaController } from './factura.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateFacturaSchema } from './factura.dto.js';

export function createFacturaRouter(controller: FacturaController): Router {
  const router = Router();
  router.post('/',    authenticate, validateBody(CreateFacturaSchema), controller.generar);
  router.get('/',     authenticate, requireAdmin, controller.listAll);
  router.get('/:id',  authenticate, controller.getById);
  return router;
}
