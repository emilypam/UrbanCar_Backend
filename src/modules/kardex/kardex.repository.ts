import { PrismaClient } from '@prisma/client';

export class KardexRepository {
  constructor(private readonly db: PrismaClient) {}

  async registrar(data: {
    vehiculoId: string;
    evento: string;
    estadoAnterior?: string;
    estadoNuevo: string;
    usuarioId?: string;
    referencia?: string;
  }): Promise<void> {
    await this.db.kardex.create({ data });
  }

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.db.kardex.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { vehiculo: { include: { modelo: { include: { marca: true } } } } },
      }),
      this.db.kardex.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
