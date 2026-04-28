import { Request, Response, NextFunction } from 'express';
import { MantenimientoService } from './mantenimiento.service.js';

export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 20;
      res.json({ success: true, data: await this.mantenimientoService.listAll(page, limit) });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.mantenimientoService.getById(req.params['id'] as string) });
    } catch (err) { next(err); }
  };

  getByVehiculo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.mantenimientoService.getByVehiculo(req.params['vehiculoId'] as string) });
    } catch (err) { next(err); }
  };

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await this.mantenimientoService.crear(req.body) });
    } catch (err) { next(err); }
  };

  actualizar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.mantenimientoService.actualizar(req.params['id'] as string, req.body) });
    } catch (err) { next(err); }
  };

  eliminar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.mantenimientoService.eliminar(req.params['id'] as string) });
    } catch (err) { next(err); }
  };
}
