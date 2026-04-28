import { PrismaClient } from '@prisma/client';

const include = {
  empresa: true,
  ciudad:  { include: { provincia: true } },
};

export class AgenciaRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(page = 1, limit = 100) {
    const skip  = (page - 1) * limit;
    const where = { isActive: true };
    const [data, total] = await Promise.all([
      this.db.agencia.findMany({ skip, take: limit, where, include, orderBy: { nombre: 'asc' } }),
      this.db.agencia.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.db.agencia.findUnique({ where: { id }, include });
  }

  async create(data: any) {
    return this.db.agencia.create({ data, include });
  }

  async update(id: string, data: any) {
    return this.db.agencia.update({ where: { id }, data, include });
  }

  async delete(id: string) {
    await this.db.agencia.update({ where: { id }, data: { isActive: false } });
  }
}
