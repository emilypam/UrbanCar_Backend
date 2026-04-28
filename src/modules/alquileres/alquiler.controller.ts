import { Request, Response, NextFunction } from 'express';
import { AlquilerService } from './alquiler.service.js';

export class AlquilerController {
  constructor(private readonly alquilerService: AlquilerService) {}

  iniciar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await this.alquilerService.iniciar(req.body) });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.alquilerService.getById(req.params['id'] as string) });
    } catch (err) { next(err); }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page  = Math.max(1, parseInt(req.query['page']  as string) || 1);
      const limit = Math.min(100, parseInt(req.query['limit'] as string) || 20);
      res.json({ success: true, ...(await this.alquilerService.listAll(page, limit)) });
    } catch (err) { next(err); }
  };
}
