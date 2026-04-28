import { Request, Response, NextFunction } from 'express';
import { PagoService } from './pago.service.js';

export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  crear = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await this.pagoService.crear(req.body) });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.pagoService.getById(req.params['id'] as string, req.user!) });
    } catch (err) { next(err); }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page  = Math.max(1, parseInt(req.query['page']  as string) || 1);
      const limit = Math.min(100, parseInt(req.query['limit'] as string) || 20);
      res.json({ success: true, ...(await this.pagoService.listAll(page, limit)) });
    } catch (err) { next(err); }
  };
}
