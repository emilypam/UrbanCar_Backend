import prisma from './database/prisma.js';

// ── Repositories ──────────────────────────────────────────────
import { UsuarioRepository }        from '../modules/usuarios/usuario.repository.js';
import { VehiculoRepository }       from '../modules/vehiculos/vehiculo.repository.js';
import { ReservaRepository }        from '../modules/reservas/reserva.repository.js';
import { AlquilerRepository }       from '../modules/alquileres/alquiler.repository.js';
import { PagoRepository }           from '../modules/pagos/pago.repository.js';
import { FacturaRepository }        from '../modules/facturas/factura.repository.js';
import { AgenciaRepository }        from '../modules/agencias/agencia.repository.js';
import { EmpresaRepository }        from '../modules/empresas/empresa.repository.js';
import { HistorialRepository }      from '../modules/historial/historial.repository.js';
import { KardexRepository }         from '../modules/kardex/kardex.repository.js';
import { OutboxRepository }         from '../modules/outbox/outbox.repository.js';
import { ClienteRepository }        from '../modules/clientes/cliente.repository.js';
import { MantenimientoRepository }  from '../modules/mantenimientos/mantenimiento.repository.js';

// ── Services ──────────────────────────────────────────────────
import { AuthService }          from '../modules/auth/auth.service.js';
import { VehiculoService }      from '../modules/vehiculos/vehiculo.service.js';
import { ReservaService }       from '../modules/reservas/reserva.service.js';
import { AlquilerService }      from '../modules/alquileres/alquiler.service.js';
import { DevolucionService }    from '../modules/devoluciones/devolucion.service.js';
import { PagoService }          from '../modules/pagos/pago.service.js';
import { FacturaService }       from '../modules/facturas/factura.service.js';
import { MantenimientoService } from '../modules/mantenimientos/mantenimiento.service.js';

// ── Controllers ───────────────────────────────────────────────
import { AuthController }           from '../modules/auth/auth.controller.js';
import { VehiculoController }       from '../modules/vehiculos/vehiculo.controller.js';
import { ReservaController }        from '../modules/reservas/reserva.controller.js';
import { AlquilerController }       from '../modules/alquileres/alquiler.controller.js';
import { DevolucionController }     from '../modules/devoluciones/devolucion.controller.js';
import { PagoController }           from '../modules/pagos/pago.controller.js';
import { FacturaController }        from '../modules/facturas/factura.controller.js';
import { CatalogosController }      from '../modules/catalogos/catalogos.controller.js';
import { ClienteController }        from '../modules/clientes/cliente.controller.js';
import { UsuarioController }        from '../modules/usuarios/usuario.controller.js';
import { MantenimientoController }  from '../modules/mantenimientos/mantenimiento.controller.js';

// ── Instanciación ─────────────────────────────────────────────
const usuarioRepo       = new UsuarioRepository(prisma);
const vehiculoRepo      = new VehiculoRepository(prisma);
const reservaRepo       = new ReservaRepository(prisma);
const alquilerRepo      = new AlquilerRepository(prisma);
const pagoRepo          = new PagoRepository(prisma);
const facturaRepo       = new FacturaRepository(prisma);
const historialRepo     = new HistorialRepository(prisma);
const kardexRepo        = new KardexRepository(prisma);
const outboxRepo        = new OutboxRepository(prisma);
const mantenimientoRepo = new MantenimientoRepository(prisma);

export const agenciaRepo = new AgenciaRepository(prisma);
export const empresaRepo = new EmpresaRepository(prisma);
export const clienteRepo = new ClienteRepository(prisma);

// ── Services ──────────────────────────────────────────────────
const authService          = new AuthService(usuarioRepo);
const vehiculoService      = new VehiculoService(vehiculoRepo);
const reservaService       = new ReservaService(reservaRepo, vehiculoRepo, outboxRepo, historialRepo, prisma);
const alquilerService      = new AlquilerService(alquilerRepo, reservaRepo, outboxRepo, kardexRepo, prisma);
const devolucionService    = new DevolucionService(alquilerRepo, reservaRepo, outboxRepo, kardexRepo, prisma);
const pagoService          = new PagoService(pagoRepo, reservaRepo, outboxRepo, historialRepo);
const facturaService       = new FacturaService(facturaRepo, reservaRepo, outboxRepo);
const mantenimientoService = new MantenimientoService(mantenimientoRepo, kardexRepo, prisma);

// ── Controllers ───────────────────────────────────────────────
export const authController           = new AuthController(authService);
export const vehiculoController       = new VehiculoController(vehiculoService);
export const reservaController        = new ReservaController(reservaService);
export const alquilerController       = new AlquilerController(alquilerService);
export const devolucionController     = new DevolucionController(devolucionService);
export const pagoController           = new PagoController(pagoService);
export const facturaController        = new FacturaController(facturaService);
export const catalogosController      = new CatalogosController(prisma);
export const clienteController        = new ClienteController(clienteRepo);
export const usuarioController        = new UsuarioController(usuarioRepo);
export const mantenimientoController  = new MantenimientoController(mantenimientoService);

export { historialRepo, kardexRepo, outboxRepo, prisma };
