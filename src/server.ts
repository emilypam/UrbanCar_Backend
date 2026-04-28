import app from './app.js';
import { prisma } from './shared/container.js';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL');

    app.listen(PORT, () => {
      console.log(`\n🚗 RentCar Ec — http://localhost:${PORT}`);
      console.log(`\n🏗️  Arquitectura: Modular (modules / shared)`);
      console.log(`\n📡 Endpoints principales:`);
      console.log(`   POST  /api/v1/auth/register`);
      console.log(`   POST  /api/v1/auth/login`);
      console.log(`   GET   /api/v1/vehiculos/marketplace`);
      console.log(`   GET   /api/v1/vehiculos/search`);
      console.log(`   POST  /api/v1/reservas           (auth)`);
      console.log(`   GET   /api/v1/reservas/my        (auth)`);
      console.log(`   POST  /api/v1/alquileres         (admin)`);
      console.log(`   POST  /api/v1/devoluciones       (admin)`);
      console.log(`   POST  /api/v1/pagos              (auth)`);
      console.log(`   POST  /api/v1/facturas           (auth)`);
      console.log(`   GET   /api/v1/historial          (admin)`);
      console.log(`   GET   /api/v1/kardex             (admin)`);
      console.log(`   GET   /api/v1/outbox-events      (admin)`);
      console.log(`\n💡 Modo: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

process.on('SIGINT',  async () => { await prisma.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
process.on('uncaughtException',  (err) => { console.error('❌ Excepción no capturada:', err); process.exit(1); });
process.on('unhandledRejection', (r)   => { console.error('❌ Promesa rechazada:', r); process.exit(1); });

startServer();
