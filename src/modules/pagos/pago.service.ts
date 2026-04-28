import { PagoRepository } from './pago.repository.js';
import { ReservaRepository } from '../reservas/reserva.repository.js';
import { HistorialRepository } from '../historial/historial.repository.js';
import { OutboxRepository } from '../outbox/outbox.repository.js';
import {
  NotFoundException, ValidationException,
} from '../../shared/errors/BusinessException.js';
import type { CreatePagoDto } from './pago.dto.js';

export class PagoService {
  constructor(
    private readonly pagoRepository: PagoRepository,
    private readonly reservaRepository: ReservaRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly historialRepository: HistorialRepository,
  ) {}

  async crear(dto: CreatePagoDto) {
    const reserva = await this.reservaRepository.findByIdWithRelations(dto.reservaId);
    if (!reserva) throw new NotFoundException('Reserva', dto.reservaId);
    if (['CANCELADA', 'COMPLETADA'].includes((reserva as any).status)) {
      throw new ValidationException(`No se puede pagar una reserva en estado ${(reserva as any).status}`);
    }
    if (Number(dto.monto) < Number((reserva as any).totalAmount)) {
      throw new ValidationException(`El monto (${dto.monto}) no cubre el total de la reserva (${(reserva as any).totalAmount})`);
    }

    const pago = await this.pagoRepository.create({
      reservaId: dto.reservaId, monto: dto.monto,
      metodoPago: dto.metodoPago, referencia: dto.referencia ?? null, status: 'COMPLETADO',
    });

    if ((reserva as any).status === 'PENDIENTE') {
      await this.reservaRepository.updateStatus(dto.reservaId, 'CONFIRMADA');
    }

    await this.outboxRepository.publicar({
      usuarioId: (reserva as any).usuarioId, evento: 'PAGO_REGISTRADO',
      payload: { pagoId: (pago as any).id, reservaId: dto.reservaId, monto: dto.monto },
    });

    await this.historialRepository.registrar({
      usuarioId: (reserva as any).usuarioId, accion: 'PAGO_REGISTRADO',
      entidad: 'Pago', entidadId: (pago as any).id,
      detalle: { monto: dto.monto, metodoPago: dto.metodoPago },
    });

    return pago;
  }

  async getById(id: string, requestingUser: { id: string; role: string }) {
    const pago = await this.pagoRepository.findByIdWithRelations(id);
    if (!pago) throw new NotFoundException('Pago', id);
    if (requestingUser.role !== 'ADMIN') {
      const reserva = await this.reservaRepository.findByIdWithRelations((pago as any).reservaId);
      if ((reserva as any)?.usuarioId !== requestingUser.id) {
        throw new NotFoundException('Pago', id);
      }
    }
    return pago;
  }

  async listAll(page = 1, limit = 20) {
    return this.pagoRepository.findAll(page, limit);
  }
}
