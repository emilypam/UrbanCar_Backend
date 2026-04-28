import { PrismaClient } from '@prisma/client';

const include = {
  vehiculo: {
    include: {
      modelo: { include: { marca: true } },
      agencia: true,
    },
  },
};

export class MantenimientoRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.db.mantenimiento.findMany({ skip, take: limit, include, orderBy: { createdAt: 'desc' } }),
      this.db.mantenimiento.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByVehiculoId(vehiculoId: string) {
    return this.db.mantenimiento.findMany({
      where: { vehiculoId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.mantenimiento.findUnique({ where: { id }, include });
  }

  async create(data: any) {
    return this.db.mantenimiento.create({ data, include });
  }

  async update(id: string, data: any) {
    return this.db.mantenimiento.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    return this.db.mantenimiento.delete({ where: { id } });
  }
}
