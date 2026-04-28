import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSearch() {
  console.log('🔍 Probando búsqueda de vehículos disponibles...');

  const vehiculos = await prisma.vehiculo.findMany({
    where: {
      status: 'DISPONIBLE',
      isActive: true,
      deletedAt: null,
    },
    include: {
      modelo: { include: { marca: true } },
      categoria: true,
      tipoCombustible: true,
      tipoTransmision: true,
      agencia: { include: { ciudad: true } },
    },
    take: 5,
  });

  console.log('🚗 Vehículos disponibles encontrados:', vehiculos.length);
  console.log(JSON.stringify(vehiculos, null, 2));
}

testSearch()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
