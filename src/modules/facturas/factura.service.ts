import { FacturaRepository } from './factura.repository.js';
import { ReservaRepository } from '../reservas/reserva.repository.js';
import { OutboxRepository } from '../outbox/outbox.repository.js';
import {
  NotFoundException, ValidationException,
} from '../../shared/errors/BusinessException.js';
import type { CreateFacturaDto } from './factura.dto.js';

export class FacturaService {
  constructor(
    private readonly facturaRepository: FacturaRepository,
    private readonly reservaRepository: ReservaRepository,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  private generarNumeroFactura(): string {
    return `FAC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }

  async generar(dto: CreateFacturaDto) {
    const reserva = await this.reservaRepository.findByIdWithRelations(dto.reservaId);
    if (!reserva) throw new NotFoundException('Reserva', dto.reservaId);
    if ((reserva as any).status === 'CANCELADA') throw new ValidationException('No se puede generar factura para una reserva cancelada');

    const subtotal = Number((reserva as any).totalAmount);
    const iva      = Math.round(subtotal * 0.15 * 100) / 100;
    const total    = Math.round((subtotal + iva) * 100) / 100;

    const detalles: any[] = [
      {
        descripcion: `Alquiler ${(reserva as any).vehiculo?.modelo?.marca?.nombre ?? ''} ${(reserva as any).vehiculo?.modelo?.nombre ?? ''} — ${(reserva as any).diasTotal} día(s)`,
        cantidad:    (reserva as any).diasTotal,
        precioUnit:  Number((reserva as any).vehiculo?.precioDia ?? (reserva as any).precioBase / (reserva as any).diasTotal),
        subtotal:    Number((reserva as any).precioBase),
      },
    ];
    if (Number((reserva as any).precioSeguro) > 0) {
      detalles.push({ descripcion: `Seguro: ${(reserva as any).seguro?.nombre ?? 'Seguro'}`, cantidad: (reserva as any).diasTotal, precioUnit: Number((reserva as any).seguro?.precioDia ?? 0), subtotal: Number((reserva as any).precioSeguro) });
    }
    if (Number((reserva as any).precioExtras) > 0) {
      detalles.push({ descripcion: 'Extras y equipamiento', cantidad: 1, precioUnit: Number((reserva as any).precioExtras), subtotal: Number((reserva as any).precioExtras) });
    }

    const factura = await this.facturaRepository.create({
      reservaId: dto.reservaId, pagoId: dto.pagoId ?? null,
      numeroFactura: this.generarNumeroFactura(),
      rucCliente: dto.rucCliente ?? null, razonSocial: dto.razonSocial ?? null,
      subtotal, iva, total, detalles,
    });

    await this.outboxRepository.publicar({
      usuarioId: (reserva as any).usuarioId, evento: 'FACTURA_GENERADA',
      payload: { facturaId: (factura as any).id, reservaId: dto.reservaId, total },
    });

    return factura;
  }

  async getById(id: string, requestingUser: { id: string; role: string }) {
    const factura = await this.facturaRepository.findByIdWithRelations(id);
    if (!factura) throw new NotFoundException('Factura', id);
    if (requestingUser.role !== 'ADMIN') {
      const reserva = await this.reservaRepository.findByIdWithRelations((factura as any).reservaId);
      if ((reserva as any)?.usuarioId !== requestingUser.id) {
        throw new NotFoundException('Factura', id);
      }
    }
    return factura;
  }

  async listAll(page = 1, limit = 20) {
    return this.facturaRepository.findAll(page, limit);
  }
}
