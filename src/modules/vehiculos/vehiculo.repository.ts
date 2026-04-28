import { PrismaClient } from '@prisma/client';

const include = {
  modelo:          { include: { marca: true } },
  categoria:       true,
  tipoCombustible: true,
  tipoTransmision: true,
  agencia:         { include: { ciudad: { include: { provincia: true } }, empresa: true } },
};

export class VehiculoRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(page = 1, limit = 20) {
    const skip  = (page - 1) * limit;
    const where = { isActive: true, deletedAt: null };
    const [data, total] = await Promise.all([
      this.db.vehiculo.findMany({ skip, take: limit, where, include, orderBy: { createdAt: 'desc' } }),
      this.db.vehiculo.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.db.vehiculo.findUnique({ where: { id } });
  }

  async findByIdWithRelations(id: string) {
    return this.db.vehiculo.findUnique({ where: { id }, include });
  }

  async findForMarketplace(params: any = {}) {
    const where: any = { isActive: true, deletedAt: null, status: 'DISPONIBLE' };
    if (params.agenciaId)         where.agenciaId         = params.agenciaId;
    if (params.categoriaId)       where.categoriaId       = params.categoriaId;
    if (params.tipoCombustibleId) where.tipoCombustibleId = params.tipoCombustibleId;
    if (params.tipoTransmisionId) where.tipoTransmisionId = params.tipoTransmisionId;
    if (params.ciudadId)          where.agencia           = { ciudadId: params.ciudadId };
    return this.db.vehiculo.findMany({ where, include, orderBy: { precioDia: 'asc' } });
  }

  async findAvailable(params: any) {
    const where: any = { isActive: true, deletedAt: null, status: 'DISPONIBLE' };
    if (params.agenciaId)         where.agenciaId         = params.agenciaId;
    if (params.categoriaId)       where.categoriaId       = params.categoriaId;
    if (params.tipoCombustibleId) where.tipoCombustibleId = params.tipoCombustibleId;
    if (params.tipoTransmisionId) where.tipoTransmisionId = params.tipoTransmisionId;
    if (params.ciudadId)          where.agencia           = { ciudadId: params.ciudadId };

    if (params.fechaInicio && params.fechaFin) {
      where.reservas = {
        none: {
          status: { in: ['PENDIENTE', 'CONFIRMADA', 'ACTIVA'] },
          AND: [
            { fechaInicio: { lte: params.fechaFin } },
            { fechaFin:    { gte: params.fechaInicio } },
          ],
        },
      };
    }
    return this.db.vehiculo.findMany({ where, include, orderBy: { precioDia: 'asc' } });
  }

  async create(data: any) {
    return this.db.vehiculo.create({ data, include });
  }

  async update(id: string, data: any) {
    return this.db.vehiculo.update({ where: { id }, data, include });
  }

  async softDelete(id: string) {
    await this.db.vehiculo.update({
      where: { id },
      data:  { isActive: false, deletedAt: new Date() },
    });
  }
}
