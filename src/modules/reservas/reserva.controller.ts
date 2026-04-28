import { Request, Response, NextFunction } from 'express';
import { ReservaService } from './reserva.service.js';

export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await this.reservaService.create(req.user!.id, req.body) });
    } catch (err) { next(err); }
  };

  myReservas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.reservaService.getMyReservas(req.user!.id) });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.reservaService.getById(req.params['id'] as string, req.user!.id, req.user!.role === 'ADMIN') });
    } catch (err) { next(err); }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.reservaService.cancel(req.params['id'] as string, req.user!.id, req.user!.role === 'ADMIN') });
    } catch (err) { next(err); }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.reservaService.updateStatus(req.params['id'] as string, req.body.status) });
    } catch (err) { next(err); }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page  = Math.max(1, parseInt(req.query['page']  as string) || 1);
      const limit = Math.min(100, parseInt(req.query['limit'] as string) || 20);
      res.json({ success: true, ...(await this.reservaService.listAll(page, limit)) });
    } catch (err) { next(err); }
  };
}
