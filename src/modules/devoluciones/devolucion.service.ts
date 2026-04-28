import { PrismaClient } from '@prisma/client';
import { AlquilerRepository } from '../alquileres/alquiler.repository.js';
import { ReservaRepository } from '../reservas/reserva.repository.js';
import { KardexRepository } from '../kardex/kardex.repository.js';
import { OutboxRepository } from '../outbox/outbox.repository.js';
import {
  NotFoundException, ValidationException,
} from '../../shared/errors/BusinessException.js';
import type { CreateDevolucionDto } from './devolucion.dto.js';

export class DevolucionService {
  constructor(
    private readonly alquilerRepository: AlquilerRepository,
    private readonly reservaRepository: ReservaRepository,
    private readonly outboxRepository: OutboxRepository,
    private readonly kardexRepository: KardexRepository,
    private readonly db: PrismaClient,
  ) {}

  async registrar(dto: CreateDevolucionDto) {
    const alquiler = await this.alquilerRepository.findByIdWithRelations(dto.alquilerId);
    if (!alquiler) throw new NotFoundException('Alquiler', dto.alquilerId);
    if ((alquiler as any).status !== 'ACTIVO') throw new ValidationException('El alquiler no está activo');
    if (dto.kmEntrada < (alquiler as any).kmSalida) throw new ValidationException('kmEntrada no puede ser menor que kmSalida');

    const devolucion = await this.db.devolucion.create({
      data: {
        alquilerId: dto.alquilerId, kmEntrada: dto.kmEntrada,
        estadoVehiculo: dto.estadoVehiculo, cargoExtra: dto.cargoExtra ?? 0,
        observaciones: dto.observaciones ?? null, fechaDevolucion: new Date(),
      },
      include: { alquiler: { include: { reserva: true } } },
    });

    await this.alquilerRepository.update(dto.alquilerId, { status: 'FINALIZADO', fechaFin: new Date(), kmEntrada: dto.kmEntrada, cargoAdicional: dto.cargoExtra ?? 0 });

    const reservaId = (alquiler as any).reserva?.id ?? (alquiler as any).reservaId;
    await this.reservaRepository.updateStatus(reservaId, 'COMPLETADA');

    const vehiculoId = (alquiler as any).reserva?.vehiculoId;
    if (vehiculoId) {
      await this.db.vehiculo.update({ where: { id: vehiculoId }, data: { status: 'DISPONIBLE', kilometraje: dto.kmEntrada } });
      await this.kardexRepository.registrar({ vehiculoId, evento: 'VEHICULO_DEVUELTO', estadoAnterior: 'EN_USO', estadoNuevo: 'DISPONIBLE', referencia: devolucion.id });
    }

    await this.outboxRepository.publicar({
      usuarioId: (alquiler as any).reserva?.usuarioId,
      evento: 'VEHICULO_DEVUELTO',
      payload: { devolucionId: devolucion.id, alquilerId: dto.alquilerId, kmEntrada: dto.kmEntrada, cargoExtra: dto.cargoExtra ?? 0 },
    });

    return devolucion;
  }

  async getById(id: string) {
    const devolucion = await this.db.devolucion.findUnique({
      where: { id },
      include: { alquiler: { include: { reserva: { include: { vehiculo: true } } } } },
    });
    if (!devolucion) throw new NotFoundException('Devolución', id);
    return devolucion;
  }

  async listAll() {
    return this.db.devolucion.findMany({
      orderBy: { createdAt: 'desc' },
      include: { alquiler: { include: { reserva: { include: { vehiculo: true, usuario: { select: { id: true, email: true, nombres: true, apellidos: true } } } } } } },
    });
  }
}
