import { VehiculoRepository } from './vehiculo.repository.js';
import {
  NotFoundException, ValidationException,
} from '../../shared/errors/BusinessException.js';

export class VehiculoService {
  constructor(private readonly vehiculoRepository: VehiculoRepository) {}

  async listAll(page = 1, limit = 20) {
    return this.vehiculoRepository.findAll(page, limit);
  }

  async listForMarketplace(params: any = {}) {
    return this.vehiculoRepository.findForMarketplace(params);
  }

  async search(params: any) {
    const { fechaInicio, fechaFin, ...rest } = params;
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin    = new Date(fechaFin);
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        throw new ValidationException('fechaInicio y fechaFin deben ser fechas válidas (YYYY-MM-DD)');
      }
      if (fin <= inicio) {
        throw new ValidationException('fechaFin debe ser posterior a fechaInicio');
      }
      return this.vehiculoRepository.findAvailable({ ...rest, fechaInicio: inicio, fechaFin: fin });
    }
    return this.vehiculoRepository.findAvailable(rest);
  }

  async getById(id: string) {
    const vehiculo = await this.vehiculoRepository.findByIdWithRelations(id);
    if (!vehiculo) throw new NotFoundException('Vehículo', id);
    return vehiculo;
  }

  async create(data: any) {
    if (!data.placa || !data.agenciaId || !data.modeloId || !data.categoriaId) {
      throw new ValidationException('placa, agenciaId, modeloId y categoriaId son requeridos');
    }
    return this.vehiculoRepository.create(data);
  }

  async update(id: string, data: any) {
    const existing = await this.vehiculoRepository.findById(id);
    if (!existing) throw new NotFoundException('Vehículo', id);
    return this.vehiculoRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.vehiculoRepository.findById(id);
    if (!existing) throw new NotFoundException('Vehículo', id);
    await this.vehiculoRepository.softDelete(id);
  }
}
