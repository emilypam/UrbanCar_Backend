import { PrismaClient } from '@prisma/client';

export class HistorialRepository {
  constructor(private readonly db: PrismaClient) {}

  async registrar(data: {
    usuarioId?: string;
    accion: string;
    entidad: string;
    entidadId: string;
    detalle?: any;
    ip?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.db.historialUsuario.create({ data });
  }

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.db.historialUsuario.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { usuario: { select: { id: true, email: true, nombres: true } } },
      }),
      this.db.historialUsuario.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
