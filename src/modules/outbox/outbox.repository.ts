import { PrismaClient } from '@prisma/client';

export class OutboxRepository {
  constructor(private readonly db: PrismaClient) {}

  async publicar(data: {
    correlationId?: string;
    usuarioId?: string;
    evento: string;
    payload: any;
  }): Promise<void> {
    await this.db.outboxEvent.create({
      data: {
        correlationId: data.correlationId,
        usuarioId:     data.usuarioId,
        evento:        data.evento,
        payload:       data.payload,
        status:        'PENDIENTE',
      },
    });
  }

  async findAll(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.db.outboxEvent.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.db.outboxEvent.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
