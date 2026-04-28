import { PrismaClient } from '@prisma/client';

const include = {
  usuario: { select: { id: true, email: true, nombres: true, apellidos: true, telefono: true } },
};

export class ClienteRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll() {
    return this.db.cliente.findMany({ include, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    return this.db.cliente.findUnique({ where: { id }, include });
  }

  async findByUsuarioId(usuarioId: string) {
    return this.db.cliente.findUnique({ where: { usuarioId }, include });
  }

  async create(data: { usuarioId: string; numeroLicencia: string; fechaVencLicencia: string }) {
    return this.db.cliente.create({
      data: {
        usuarioId:        data.usuarioId,
        numeroLicencia:   data.numeroLicencia,
        fechaVencLicencia: new Date(data.fechaVencLicencia),
      },
      include,
    });
  }

  async update(id: string, data: { numeroLicencia?: string; fechaVencLicencia?: string }) {
    return this.db.cliente.update({
      where: { id },
      data: {
        ...(data.numeroLicencia   && { numeroLicencia: data.numeroLicencia }),
        ...(data.fechaVencLicencia && { fechaVencLicencia: new Date(data.fechaVencLicencia) }),
      },
      include,
    });
  }

  async delete(id: string) {
    return this.db.cliente.delete({ where: { id } });
  }
}
