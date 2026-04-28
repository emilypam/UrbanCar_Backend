import { Router } from 'express';
import { AgenciaRepository } from './agencia.repository.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateAgenciaSchema, UpdateAgenciaSchema } from './agencia.dto.js';

export function createAgenciaRouter(repo: AgenciaRepository): Router {
  const router = Router();

  router.get('/',        async (req, res, next) => { try { res.json({ success: true, data: await repo.findAll() }); } catch (e) { next(e); } });
  router.get('/:id',     async (req, res, next) => { try { res.json({ success: true, data: await repo.findById(req.params['id'] as string) }); } catch (e) { next(e); } });
  router.post('/',       authenticate, requireAdmin, validateBody(CreateAgenciaSchema), async (req, res, next) => { try { res.status(201).json({ success: true, data: await repo.create(req.body) }); } catch (e) { next(e); } });
  router.patch('/:id',   authenticate, requireAdmin, validateBody(UpdateAgenciaSchema), async (req, res, next) => { try { res.json({ success: true, data: await repo.update(req.params['id'] as string, req.body) }); } catch (e) { next(e); } });
  router.delete('/:id',  authenticate, requireAdmin, async (req, res, next) => { try { await repo.delete(req.params['id'] as string); res.json({ success: true, data: { deleted: true } }); } catch (e) { next(e); } });

  return router;
}
