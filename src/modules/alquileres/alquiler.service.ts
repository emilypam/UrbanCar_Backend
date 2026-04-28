import { PrismaClient } from '@prisma/client';
import { AlquilerRepository } from './alquiler.repository.js';
import { ReservaRepository } from '../reservas/reserva.repository.js';
import { KardexRepository } from '../kardex/kardex.repository.js';
import { OutboxRepository } from '../outbox/outbox.repository.js';
import {
  NotFoundException, ValidationException,
} from '../../shared/errors/BusinessException.js';
import type { CreateAlquilerDto } from './alquiler.dto.js';

export class AlquilerService {
  constructor(
    private readonly alquilerRepository: AlquilerRepository,
    private readonly reservaRepository: ReservaRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly kardexRepository: KardexRepository,
    private readonly db: PrismaClient,
  ) {}

  async iniciar(dto: CreateAlquilerDto) {
    const reserva = await this.reservaRepository.findByIdWithRelations(dto.reservaId);
    if (!reserva) throw new NotFoundException('Reserva', dto.reservaId);
    if ((reserva as any).status !== 'CONFIRMADA') {
      throw new ValidationException(`La reserva debe estar CONFIRMADA para iniciar el alquiler (estado actual: ${(reserva as any).status}). Registra el pago primero.`);
    }

    const existente = await this.alquilerRepository.findByReservaId(dto.reservaId);
    if (existente) throw new ValidationException('Ya existe un alquiler para esta reserva');

    const alquiler = await this.alquilerRepository.create({
      reservaId: dto.reservaId, kmSalida: dto.kmSalida,
      fechaInicio: new Date(), observaciones: dto.observaciones ?? null, status: 'ACTIVO',
    });

    await this.reservaRepository.updateStatus(dto.reservaId, 'ACTIVA');
    await this.db.vehiculo.update({ where: { id: (reserva as any).vehiculoId }, data: { status: 'EN_USO' } });

    await this.kardexRepository.registrar({
      vehiculoId: (reserva as any).vehiculoId, evento: 'ALQUILER_INICIADO',
      estadoAnterior: 'DISPONIBLE', estadoNuevo: 'EN_USO', referencia: (alquiler as any).id,
    });

    await this.outboxRepository.publicar({
      usuarioId: (reserva as any).usuarioId, evento: 'ALQUILER_INICIADO',
      payload: { alquilerId: (alquiler as any).id, reservaId: dto.reservaId, kmSalida: dto.kmSalida },
    });

    return alquiler;
  }

  async getById(id: string) {
    const alquiler = await this.alquilerRepository.findByIdWithRelations(id);
    if (!alquiler) throw new NotFoundException('Alquiler', id);
    return alquiler;
  }

  async listAll(page = 1, limit = 20) {
    return this.alquilerRepository.findAll(page, limit);
  }
}
