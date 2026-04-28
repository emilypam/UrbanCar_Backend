import { Router } from 'express';
import { ClienteController } from './cliente.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateClienteSchema, UpdateClienteSchema } from './cliente.dto.js';

export function createClienteRouter(controller: ClienteController): Router {
  const router = Router();

  router.get('/',       authenticate, requireAdmin, controller.listAll);
  router.get('/:id',    authenticate, requireAdmin, controller.getById);
  router.post('/',      authenticate, requireAdmin, validateBody(CreateClienteSchema), controller.create);
  router.patch('/:id',  authenticate, requireAdmin, validateBody(UpdateClienteSchema), controller.update);
  router.delete('/:id', authenticate, requireAdmin, controller.remove);

  return router;
}
