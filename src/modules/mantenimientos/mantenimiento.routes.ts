import { Router } from 'express';
import { MantenimientoController } from './mantenimiento.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateMantenimientoSchema, UpdateMantenimientoSchema } from './mantenimiento.dto.js';

export function createMantenimientoRouter(controller: MantenimientoController): Router {
  const router = Router();

  router.use(authenticate, requireAdmin);

  router.get('/',                           controller.listAll);
  router.get('/:id',                        controller.getById);
  router.get('/vehiculo/:vehiculoId',        controller.getByVehiculo);
  router.post('/',    validateBody(CreateMantenimientoSchema), controller.crear);
  router.patch('/:id', validateBody(UpdateMantenimientoSchema), controller.actualizar);
  router.delete('/:id',                     controller.eliminar);

  return router;
}
