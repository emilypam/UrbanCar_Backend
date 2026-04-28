import { PrismaClient } from '@prisma/client';
import { MantenimientoRepository } from './mantenimiento.repository.js';
import { KardexRepository } from '../kardex/kardex.repository.js';
import { NotFoundException, ValidationException } from '../../shared/errors/BusinessException.js';
import type { CreateMantenimientoDto, UpdateMantenimientoDto } from './mantenimiento.dto.js';

export class MantenimientoService {
  constructor(
    private readonly mantenimientoRepository: MantenimientoRepository,
    private readonly kardexRepository: KardexRepository,
    private readonly db: PrismaClient,
  ) {}

  async listAll(page = 1, limit = 20) {
    return this.mantenimientoRepository.findAll(page, limit);
  }

  async getById(id: string) {
    const m = await this.mantenimientoRepository.findById(id);
    if (!m) throw new NotFoundException('Mantenimiento', id);
    return m;
  }

  async getByVehiculo(vehiculoId: string) {
    return this.mantenimientoRepository.findByVehiculoId(vehiculoId);
  }

  async crear(dto: CreateMantenimientoDto) {
    const vehiculo = await this.db.vehiculo.findUnique({ where: { id: dto.vehiculoId } });
    if (!vehiculo) throw new NotFoundException('Vehículo', dto.vehiculoId);
    if (vehiculo.status === 'MANTENIMIENTO') {
      throw new ValidationException('El vehículo ya está en mantenimiento');
    }

    const estadoAnterior = vehiculo.status;

    const mantenimiento = await this.mantenimientoRepository.create({
      vehiculoId:  dto.vehiculoId,
      tipo:        dto.tipo,
      descripcion: dto.descripcion,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin:    dto.fechaFin ? new Date(dto.fechaFin) : null,
      costo:       dto.costo ?? null,
      tecnico:     dto.tecnico ?? null,
    });

    await this.db.vehiculo.update({
      where: { id: dto.vehiculoId },
      data: { status: 'MANTENIMIENTO' },
    });

    await this.kardexRepository.registrar({
      vehiculoId:    dto.vehiculoId,
      evento:        'MANTENIMIENTO_INICIADO',
      estadoAnterior,
      estadoNuevo:   'MANTENIMIENTO',
      referencia:    (mantenimiento as any).id,
    });

    return mantenimiento;
  }

  async actualizar(id: string, dto: UpdateMantenimientoDto) {
    const mantenimiento = await this.mantenimientoRepository.findById(id);
    if (!mantenimiento) throw new NotFoundException('Mantenimiento', id);

    const data: any = {};
    if (dto.tipo)        data.tipo        = dto.tipo;
    if (dto.descripcion) data.descripcion = dto.descripcion;
    if (dto.fechaInicio) data.fechaInicio = new Date(dto.fechaInicio);
    if (dto.fechaFin)    data.fechaFin    = new Date(dto.fechaFin);
    if (dto.costo !== undefined)   data.costo   = dto.costo;
    if (dto.tecnico !== undefined) data.tecnico  = dto.tecnico;

    // Si se marca como inactivo (finalizado), restaurar el vehículo a DISPONIBLE
    if (dto.isActive === false && (mantenimiento as any).isActive) {
      data.isActive = false;
      const vehiculoId = (mantenimiento as any).vehiculoId;
      await this.db.vehiculo.update({ where: { id: vehiculoId }, data: { status: 'DISPONIBLE' } });
      await this.kardexRepository.registrar({
        vehiculoId,
        evento:        'MANTENIMIENTO_FINALIZADO',
        estadoAnterior: 'MANTENIMIENTO',
        estadoNuevo:   'DISPONIBLE',
        referencia:    id,
      });
    }

    return this.mantenimientoRepository.update(id, data);
  }

  async eliminar(id: string) {
    const m = await this.mantenimientoRepository.findById(id);
    if (!m) throw new NotFoundException('Mantenimiento', id);
    await this.mantenimientoRepository.delete(id);
    return { deleted: true };
  }
}
