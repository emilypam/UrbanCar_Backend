import { Router } from 'express';
import { VehiculoController } from './vehiculo.controller.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { uploadVehiculo } from '../../shared/middlewares/upload.middleware.js';
import { CreateVehiculoSchema, UpdateVehiculoSchema } from './vehiculo.dto.js';

export function createVehiculoRouter(controller: VehiculoController): Router {
  const router = Router();

  router.get('/marketplace', controller.marketplace);
  router.get('/search',      controller.search);
  router.get('/:id',         controller.getById);
  router.get('/',            authenticate, requireAdmin, controller.list);

  router.post('/',            authenticate, requireAdmin, validateBody(CreateVehiculoSchema), controller.create);
  router.post('/:id/imagen',  authenticate, requireAdmin, uploadVehiculo, controller.uploadImagen);
  router.patch('/:id',        authenticate, requireAdmin, validateBody(UpdateVehiculoSchema), controller.update);
  router.delete('/:id',       authenticate, requireAdmin, controller.remove);

  return router;
}
