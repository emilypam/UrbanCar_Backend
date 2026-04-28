import { Router } from 'express';
import { EmpresaRepository } from './empresa.repository.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';
import { validateBody } from '../../shared/middlewares/validate.middleware.js';
import { CreateEmpresaSchema, UpdateEmpresaSchema } from './empresa.dto.js';

export function createEmpresaRouter(repo: EmpresaRepository): Router {
  const router = Router();

  router.get('/',        async (req, res, next) => { try { res.json({ success: true, data: await repo.findAll() }); } catch (e) { next(e); } });
  router.get('/:id',     async (req, res, next) => { try { res.json({ success: true, data: await repo.findById(req.params['id'] as string) }); } catch (e) { next(e); } });
  router.post('/',       authenticate, requireAdmin, validateBody(CreateEmpresaSchema), async (req, res, next) => { try { res.status(201).json({ success: true, data: await repo.create(req.body) }); } catch (e) { next(e); } });
  router.patch('/:id',   authenticate, requireAdmin, validateBody(UpdateEmpresaSchema), async (req, res, next) => { try { res.json({ success: true, data: await repo.update(req.params['id'] as string, req.body) }); } catch (e) { next(e); } });
  router.delete('/:id',  authenticate, requireAdmin, async (req, res, next) => { try { await repo.delete(req.params['id'] as string); res.json({ success: true, data: { deleted: true } }); } catch (e) { next(e); } });

  return router;
}
