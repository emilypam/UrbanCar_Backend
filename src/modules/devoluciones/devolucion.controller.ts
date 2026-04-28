import { Request, Response, NextFunction } from 'express';
import { DevolucionService } from './devolucion.service.js';

export class DevolucionController {
  constructor(private readonly devolucionService: DevolucionService) {}

  registrar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await this.devolucionService.registrar(req.body) });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.devolucionService.getById(req.params['id'] as string) });
    } catch (err) { next(err); }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.devolucionService.listAll() });
    } catch (err) { next(err); }
  };
}
