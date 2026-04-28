import { PrismaClient } from '@prisma/client';

const include = {
  reserva: {
    include: {
      vehiculo: { include: { modelo: { include: { marca: true } } } },
      usuario:  { select: { id: true, email: true, nombres: true, apellidos: true } },
    },
  },
  factura: true,
};

export class PagoRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.db.pago.findMany({ skip, take: limit, include, orderBy: { createdAt: 'desc' } }),
      this.db.pago.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.db.pago.findUnique({ where: { id } });
  }

  async findByIdWithRelations(id: string) {
    return this.db.pago.findUnique({ where: { id }, include });
  }

  async findAllWithRelations() {
    return this.db.pago.findMany({ include, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.db.pago.create({ data, include });
  }
}
