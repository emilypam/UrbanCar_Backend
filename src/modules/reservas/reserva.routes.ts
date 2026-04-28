import { Router } from 'express';
import { ReservaController } from './reserva.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateReservaSchema, UpdateReservaStatusSchema } from './reserva.dto.js';

export function createReservaRouter(controller: ReservaController): Router {
  const router = Router();

  router.post('/',             authenticate, validateBody(CreateReservaSchema), controller.create);
  router.get('/my',            authenticate, controller.myReservas);
  router.get('/:id',           authenticate, controller.getById);
  router.patch('/:id/cancel',   authenticate, controller.cancel);
  router.patch('/:id/cancelar', authenticate, controller.cancel);

  router.get('/',      authenticate, requireAdmin, controller.listAll);
  router.patch('/:id', authenticate, requireAdmin, validateBody(UpdateReservaStatusSchema), controller.updateStatus);

  return router;
}
