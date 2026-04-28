import 'dotenv/config';
import { randomUUID } from 'crypto';
import path from 'path';
import express from 'express';
import cors from 'cors';

// ── Routers ───────────────────────────────────────────────────
import { createAuthRouter }           from './modules/auth/auth.routes.js';
import { createVehiculoRouter }       from './modules/vehiculos/vehiculo.routes.js';
import { createAgenciaRouter }        from './modules/agencias/agencia.routes.js';
import { createEmpresaRouter }        from './modules/empresas/empresa.routes.js';
import { createCatalogosRouter }      from './modules/catalogos/catalogos.routes.js';
import { createReservaRouter }        from './modules/reservas/reserva.routes.js';
import { createAlquilerRouter }       from './modules/alquileres/alquiler.routes.js';
import { createDevolucionRouter }     from './modules/devoluciones/devolucion.routes.js';
import { createPagoRouter }           from './modules/pagos/pago.routes.js';
import { createFacturaRouter }        from './modules/facturas/factura.routes.js';
import { createHistorialRouter }      from './modules/historial/historial.routes.js';
import { createKardexRouter }         from './modules/kardex/kardex.routes.js';
import { createOutboxRouter }         from './modules/outbox/outbox.routes.js';
import { createClienteRouter }        from './modules/clientes/cliente.routes.js';
import { createUsuarioRouter }        from './modules/usuarios/usuario.routes.js';
import { createMantenimientoRouter }  from './modules/mantenimientos/mantenimiento.routes.js';
import { errorHandler }               from './shared/errors/error.middleware.js';
import { swaggerSpec }                from './docs/swagger.js';

// ── DI Container ──────────────────────────────────────────────
import {
  authController,
  vehiculoController,
  reservaController,
  alquilerController,
  devolucionController,
  pagoController,
  facturaController,
  catalogosController,
  clienteController,
  usuarioController,
  mantenimientoController,
  agenciaRepo,
  empresaRepo,
  historialRepo,
  kardexRepo,
  outboxRepo,
} from './shared/container.js';

// ─────────────────────────────────────────────────────────────
const app = express();

app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────
const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [];

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:4200',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  ...envOrigins,
].filter(Boolean) as string[];

const localhostRe = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(cors({
  origin(origin, cb) {
    if (!origin || localhostRe.test(origin) || allowedOrigins.includes(origin)) return cb(null, true);
    console.warn('⚠️  CORS bloqueado:', origin);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'public', 'uploads')));

// ── Correlation ID ────────────────────────────────────────────
app.use((req, res, next) => {
  const cid = (req.headers['x-correlation-id'] as string) || randomUUID();
  req.headers['x-correlation-id'] = cid;
  res.setHeader('X-Correlation-Id', cid);
  next();
});

// ── Logger (solo desarrollo) ──────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      method: req.method,
      path: req.path,
      cid: req.headers['x-correlation-id'],
    }));
    next();
  });
}

// ── Health check ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'RentCar Ec — Sistema de Alquiler de Autos',
    version: '1.0.0',
    status: 'online',
    architecture: 'Modular (modules / shared)',
    apiVersion: 'v1',
    docs: '/api/v1/docs',
    endpoints: {
      auth:            '/api/v1/auth',
      vehiculos:       '/api/v1/vehiculos',
      agencias:        '/api/v1/agencias',
      empresas:        '/api/v1/empresas',
      reservas:        '/api/v1/reservas',
      alquileres:      '/api/v1/alquileres',
      devoluciones:    '/api/v1/devoluciones',
      pagos:           '/api/v1/pagos',
      facturas:        '/api/v1/facturas',
      clientes:        '/api/v1/clientes',
      usuarios:        '/api/v1/usuarios',
      mantenimientos:  '/api/v1/mantenimientos',
      historial:       '/api/v1/historial',
      kardex:          '/api/v1/kardex',
      outboxEvents:    '/api/v1/outbox-events',
      catalogos:       '/api/v1/catalogos',
    },
  });
});

// ── Rutas principales ─────────────────────────────────────────
app.use('/api/v1/auth',           createAuthRouter(authController));
app.use('/api/v1/vehiculos',      createVehiculoRouter(vehiculoController));
app.use('/api/v1/agencias',       createAgenciaRouter(agenciaRepo));
app.use('/api/v1/empresas',       createEmpresaRouter(empresaRepo));
app.use('/api/v1/catalogos',      createCatalogosRouter(catalogosController));
app.use('/api/v1/reservas',       createReservaRouter(reservaController));
app.use('/api/v1/alquileres',     createAlquilerRouter(alquilerController));
app.use('/api/v1/devoluciones',   createDevolucionRouter(devolucionController));
app.use('/api/v1/pagos',          createPagoRouter(pagoController));
app.use('/api/v1/facturas',       createFacturaRouter(facturaController));
app.use('/api/v1/historial',      createHistorialRouter(historialRepo));
app.use('/api/v1/kardex',         createKardexRouter(kardexRepo));
app.use('/api/v1/outbox-events',  createOutboxRouter(outboxRepo));
app.use('/api/v1/clientes',       createClienteRouter(clienteController));
app.use('/api/v1/usuarios',       createUsuarioRouter(usuarioController));
app.use('/api/v1/mantenimientos', createMantenimientoRouter(mantenimientoController));

// ── Catálogos en raíz /api/v1 (aliases directos) ─────────────
app.use('/api/v1', createCatalogosRouter(catalogosController));

// ── Swagger UI (vía CDN) ──────────────────────────────────────
app.get('/api/v1/docs/spec', (_req, res) => res.json(swaggerSpec));
app.get('/api/v1/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <title>RentCar Ec — API Docs v1</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f7fa; }

    /* ── Topbar override ── */
    .swagger-ui .topbar { background: #0f172a; padding: 8px 0; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }

    /* ── Header banner ── */
    #rc-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
      color: #fff;
      padding: 0;
    }
    #rc-header .rc-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 24px 16px;
    }
    #rc-header .rc-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    #rc-header .rc-title .rc-logo {
      background: #22c55e;
      color: #fff;
      font-weight: 800;
      font-size: 18px;
      padding: 6px 12px;
      border-radius: 8px;
      letter-spacing: 0.5px;
    }
    #rc-header .rc-title h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #f1f5f9;
    }
    #rc-header .rc-title .rc-badge {
      background: #1d4ed8;
      color: #bfdbfe;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }

    /* ── Cards row ── */
    #rc-header .rc-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }
    .rc-card {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 200px;
      flex: 1;
    }
    .rc-card .rc-card-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 6px;
    }
    .rc-card .rc-card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .rc-card .rc-card-email {
      font-size: 13px;
      color: #e2e8f0;
      font-family: monospace;
    }
    .rc-card .rc-card-pass {
      font-size: 12px;
      background: rgba(34,197,94,0.15);
      color: #86efac;
      border: 1px solid rgba(34,197,94,0.3);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: monospace;
    }
    .rc-card .rc-card-role {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .rc-card .rc-card-role.admin  { background: #dc262620; color: #fca5a5; border: 1px solid #dc262640; }
    .rc-card .rc-card-role.client { background: #0284c720; color: #7dd3fc; border: 1px solid #0284c740; }

    /* ── Steps ── */
    #rc-header .rc-steps {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .rc-step {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #cbd5e1;
    }
    .rc-step .rc-step-num {
      background: #1d4ed8;
      color: #fff;
      font-weight: 700;
      font-size: 11px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .rc-step code {
      background: rgba(255,255,255,0.1);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 11px;
      color: #fde68a;
    }
    .rc-arrow { color: #475569; font-size: 14px; }

    /* ── Swagger UI tweaks ── */
    .swagger-ui .info { margin: 20px 0 10px; }
    .swagger-ui .info .title { font-size: 28px; color: #0f172a; }
    .swagger-ui .scheme-container { background: #f8fafc; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .swagger-ui .opblock-tag { font-size: 15px; }
    .swagger-ui .opblock.opblock-get    .opblock-summary-method { background: #2563eb; }
    .swagger-ui .opblock.opblock-post   .opblock-summary-method { background: #16a34a; }
    .swagger-ui .opblock.opblock-patch  .opblock-summary-method { background: #d97706; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626; }
    .swagger-ui .btn.authorize { border-color: #22c55e; color: #16a34a; font-weight: 600; }
    .swagger-ui .btn.authorize svg { fill: #16a34a; }
  </style>
</head>
<body>
  <div id="rc-header">
    <div class="rc-inner">
      <div class="rc-title">
        <span class="rc-logo">RC</span>
        <h1>RentCar Ec &mdash; API de Alquiler de Autos</h1>
        <span class="rc-badge">v1 &bull; REST &bull; OpenAPI 3.0</span>
      </div>

      <div class="rc-cards">
        <div class="rc-card">
          <div class="rc-card-label">Credencial Admin</div>
          <div class="rc-card-row">
            <span class="rc-card-email">admin@rentcar.ec</span>
            <span class="rc-card-role admin">ADMIN</span>
          </div>
          <div class="rc-card-row">
            <span style="font-size:11px;color:#64748b;">Password:</span>
            <span class="rc-card-pass">Admin2025!</span>
          </div>
        </div>
        <div class="rc-card">
          <div class="rc-card-label">Credencial Cliente</div>
          <div class="rc-card-row">
            <span class="rc-card-email">cliente@test.ec</span>
            <span class="rc-card-role client">CLIENTE</span>
          </div>
          <div class="rc-card-row">
            <span style="font-size:11px;color:#64748b;">Password:</span>
            <span class="rc-card-pass">Cliente2025!</span>
          </div>
        </div>
        <div class="rc-card" style="min-width:260px;">
          <div class="rc-card-label">Flujo principal</div>
          <div style="font-size:11px;color:#94a3b8;line-height:1.7;">
            Registro &rarr; Login &rarr; Buscar vehículo<br>
            Reserva &rarr; Pago &rarr; Alquiler &rarr; Devolución &rarr; Factura
          </div>
        </div>
      </div>

      <div class="rc-steps">
        <div class="rc-step">
          <span class="rc-step-num">1</span>
          <span>Ejecuta <code>POST /auth/login</code></span>
        </div>
        <span class="rc-arrow">›</span>
        <div class="rc-step">
          <span class="rc-step-num">2</span>
          <span>Copia el campo <code>data.token</code></span>
        </div>
        <span class="rc-arrow">›</span>
        <div class="rc-step">
          <span class="rc-step-num">3</span>
          <span>Clic en <strong style="color:#22c55e;">Authorize 🔒</strong> (arriba a la derecha)</span>
        </div>
        <span class="rc-arrow">›</span>
        <div class="rc-step">
          <span class="rc-step-num">4</span>
          <span>Pega el token &rarr; <strong style="color:#22c55e;">Authorize</strong> &rarr; Close</span>
        </div>
      </div>
    </div>
  </div>

  <div id="swagger-ui"></div>

  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/v1/docs/spec',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      layout: 'StandaloneLayout',
      deepLinking: true,
      tryItOutEnabled: true,
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: 2,
      filter: true,
      syntaxHighlight: { activated: true, theme: 'monokai' },
      requestSnippetsEnabled: true,
    });
  </script>
</body>
</html>`);
});

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Ruta ${req.originalUrl} no encontrada` },
  });
});

// ── Error handler global ──────────────────────────────────────
app.use(errorHandler);

export default app;
