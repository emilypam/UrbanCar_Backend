import { Router } from 'express';
import { CatalogosController } from './catalogos.controller.js';

export function createCatalogosRouter(controller: CatalogosController): Router {
  const router = Router();

  // Rutas públicas (sin auth)
  router.get('/marcas',              controller.getMarcas);
  router.get('/modelos',             controller.getModelos);
  router.get('/categorias',          controller.getCategorias);
  router.get('/tipos-combustible',   controller.getCombustibles);
  router.get('/tipos-transmision',   controller.getTransmisiones);
  router.get('/extras',              controller.getExtras);
  router.get('/seguros',             controller.getSeguros);
  router.get('/tarifas',             controller.getTarifas);
  router.get('/canales-venta',       controller.getCanalesVenta);
  router.get('/provincias',          controller.getProvincias);
  router.get('/ciudades',            controller.getCiudades);
  router.get('/sistemas-externos',   controller.getSistemasExternos);
  router.get('/estados-vehiculo',    controller.getEstadosVehiculo);

  return router;
}
