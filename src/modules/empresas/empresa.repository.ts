import { PrismaClient } from '@prisma/client';

export class EmpresaRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(page = 1, limit = 100) {
    const skip  = (page - 1) * limit;
    const where = { isActive: true };
    const [data, total] = await Promise.all([
      this.db.empresa.findMany({ skip, take: limit, where, orderBy: { nombre: 'asc' } }),
      this.db.empresa.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return this.db.empresa.findUnique({
      where: { id },
      include: { agencias: { include: { ciudad: true } } },
    });
  }

  async create(data: any) {
    return this.db.empresa.create({ data });
  }

  async update(id: string, data: any) {
    return this.db.empresa.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.db.empresa.update({ where: { id }, data: { isActive: false } });
  }
}
