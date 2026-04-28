import { PrismaClient } from '@prisma/client';

const include = {
  reserva: {
    include: {
      vehiculo: { include: { modelo: { include: { marca: true } } } },
      usuario:  { select: { id: true, email: true, nombres: true, apellidos: true } },
    },
  },
  pago:     true,
  detalles: true,
};

export class FacturaRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.db.factura.findMany({ skip, take: limit, include, orderBy: { createdAt: 'desc' } }),
      this.db.factura.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByIdWithRelations(id: string) {
    return this.db.factura.findUnique({ where: { id }, include });
  }

  async findAllWithRelations() {
    return this.db.factura.findMany({ include, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    const { detalles, ...facturaData } = data;
    return this.db.factura.create({
      data: { ...facturaData, ...(detalles?.length ? { detalles: { create: detalles } } : {}) },
      include,
    });
  }
}
