import { Router } from 'express';
import { KardexRepository } from './kardex.repository.js';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware.js';

export function createKardexRouter(repo: KardexRepository): Router {
  const router = Router();
  router.use(authenticate, requireAdmin);
  router.get('/', async (req, res, next) => {
    try {
      const page  = Number(req.query.page)  || 1;
      const limit = Number(req.query.limit) || 50;
      res.json({ success: true, data: await repo.findAll(page, limit) });
    } catch (e) { next(e); }
  });
  return router;
}
