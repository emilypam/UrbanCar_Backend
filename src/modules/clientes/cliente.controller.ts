import { Request, Response, NextFunction } from 'express';
import { ClienteRepository } from './cliente.repository.js';
import { NotFoundException } from '../../shared/errors/BusinessException.js';

export class ClienteController {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  listAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.clienteRepository.findAll() });
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cliente = await this.clienteRepository.findById(req.params['id'] as string);
      if (!cliente) throw new NotFoundException('Cliente', req.params['id'] as string);
      res.json({ success: true, data: cliente });
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ success: true, data: await this.clienteRepository.create(req.body) });
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ success: true, data: await this.clienteRepository.update(req.params['id'] as string, req.body) });
    } catch (err) { next(err); }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.clienteRepository.delete(req.params['id'] as string);
      res.json({ success: true, data: { deleted: true } });
    } catch (err) { next(err); }
  };
}
