import {
  PrismaClient,
  UserRole,
  VehicleStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed — Sistema de Alquiler de Autos...');

  // ── 1. PROVINCIAS ────────────────────────────────────────────
  const pichincha = await prisma.provincia.upsert({
    where: { codigo: 'PIC' },
    update: {},
    create: { nombre: 'Pichincha', codigo: 'PIC' },
  });
  const guayas = await prisma.provincia.upsert({
    where: { codigo: 'GUA' },
    update: {},
    create: { nombre: 'Guayas', codigo: 'GUA' },
  });
  const azuay = await prisma.provincia.upsert({
    where: { codigo: 'AZU' },
    update: {},
    create: { nombre: 'Azuay', codigo: 'AZU' },
  });

  // ── 2. CIUDADES ──────────────────────────────────────────────
  const quito = await prisma.ciudad.upsert({
    where: { nombre_provinciaId: { nombre: 'Quito', provinciaId: pichincha.id } },
    update: {},
    create: { nombre: 'Quito', provinciaId: pichincha.id },
  });
  const guayaquil = await prisma.ciudad.upsert({
    where: { nombre_provinciaId: { nombre: 'Guayaquil', provinciaId: guayas.id } },
    update: {},
    create: { nombre: 'Guayaquil', provinciaId: guayas.id },
  });
  const cuenca = await prisma.ciudad.upsert({
    where: { nombre_provinciaId: { nombre: 'Cuenca', provinciaId: azuay.id } },
    update: {},
    create: { nombre: 'Cuenca', provinciaId: azuay.id },
  });

  // ── 3. EMPRESAS ──────────────────────────────────────────────
  const rentcar = await prisma.empresa.upsert({
    where: { ruc: '1791234567001' },
    update: {},
    create: {
      nombre: 'RentCar Ecuador',
      ruc: '1791234567001',
      email: 'info@rentcarecuador.com',
      telefono: '+593 2 2345678',
    },
  });
  const autofast = await prisma.empresa.upsert({
    where: { ruc: '0992345678001' },
    update: {},
    create: {
      nombre: 'AutoFast',
      ruc: '0992345678001',
      email: 'info@autofast.ec',
      telefono: '+593 4 3456789',
    },
  });

  // ── 4. AGENCIAS ──────────────────────────────────────────────
  const agQuitoNorte = await prisma.agencia.upsert({
    where: { id: 'ag-quito-norte-001' },
    update: {},
    create: {
      id: 'ag-quito-norte-001',
      empresaId: rentcar.id,
      ciudadId: quito.id,
      nombre: 'Quito Norte',
      direccion: 'Av. de los Shyris N36-152',
      telefono: '+593 2 2233445',
      email: 'quitonorte@rentcarecuador.com',
    },
  });
  const agGye = await prisma.agencia.upsert({
    where: { id: 'ag-guayaquil-001' },
    update: {},
    create: {
      id: 'ag-guayaquil-001',
      empresaId: autofast.id,
      ciudadId: guayaquil.id,
      nombre: 'Guayaquil Centro',
      direccion: 'Av. 9 de Octubre 100 y Malecón',
      telefono: '+593 4 4556677',
      email: 'gye@autofast.ec',
    },
  });
  const agCuenca = await prisma.agencia.upsert({
    where: { id: 'ag-cuenca-001' },
    update: {},
    create: {
      id: 'ag-cuenca-001',
      empresaId: rentcar.id,
      ciudadId: cuenca.id,
      nombre: 'Cuenca Centro',
      direccion: 'Benigno Malo 5-75',
      telefono: '+593 7 2887766',
      email: 'cuenca@rentcarecuador.com',
    },
  });

  // ── 5. MARCAS Y MODELOS ──────────────────────────────────────
  const toyota = await prisma.marca.upsert({
    where: { nombre: 'Toyota' },
    update: {},
    create: { nombre: 'Toyota' },
  });
  const chevrolet = await prisma.marca.upsert({
    where: { nombre: 'Chevrolet' },
    update: {},
    create: { nombre: 'Chevrolet' },
  });
  const kia = await prisma.marca.upsert({
    where: { nombre: 'Kia' },
    update: {},
    create: { nombre: 'Kia' },
  });
  const hyundai = await prisma.marca.upsert({
    where: { nombre: 'Hyundai' },
    update: {},
    create: { nombre: 'Hyundai' },
  });

  const corolla = await prisma.modelo.upsert({
    where: { marcaId_nombre: { marcaId: toyota.id, nombre: 'Corolla' } },
    update: {},
    create: { marcaId: toyota.id, nombre: 'Corolla' },
  });
  const dmax = await prisma.modelo.upsert({
    where: { marcaId_nombre: { marcaId: chevrolet.id, nombre: 'D-Max' } },
    update: {},
    create: { marcaId: chevrolet.id, nombre: 'D-Max' },
  });
  const sportage = await prisma.modelo.upsert({
    where: { marcaId_nombre: { marcaId: kia.id, nombre: 'Sportage' } },
    update: {},
    create: { marcaId: kia.id, nombre: 'Sportage' },
  });
  const tucson = await prisma.modelo.upsert({
    where: { marcaId_nombre: { marcaId: hyundai.id, nombre: 'Tucson' } },
    update: {},
    create: { marcaId: hyundai.id, nombre: 'Tucson' },
  });
  const picanto = await prisma.modelo.upsert({
    where: { marcaId_nombre: { marcaId: kia.id, nombre: 'Picanto' } },
    update: {},
    create: { marcaId: kia.id, nombre: 'Picanto' },
  });

  // ── 6. CATEGORÍAS ────────────────────────────────────────────
  const catEconomico = await prisma.categoria.upsert({
    where: { nombre: 'Económico' },
    update: {},
    create: { nombre: 'Económico', descripcion: 'Vehículos de bajo consumo y precio accesible' },
  });
  const catSedan = await prisma.categoria.upsert({
    where: { nombre: 'Sedán' },
    update: {},
    create: { nombre: 'Sedán', descripcion: 'Vehículos sedán cómodos para ciudad' },
  });
  const catSuv = await prisma.categoria.upsert({
    where: { nombre: 'SUV' },
    update: {},
    create: { nombre: 'SUV', descripcion: 'Vehículos SUV para todo terreno' },
  });
  const catPickup = await prisma.categoria.upsert({
    where: { nombre: 'Pickup' },
    update: {},
    create: { nombre: 'Pickup', descripcion: 'Camionetas de carga y trabajo' },
  });

  // ── 7. COMBUSTIBLES ──────────────────────────────────────────
  const gasolina = await prisma.tipoCombustible.upsert({
    where: { nombre: 'Gasolina' },
    update: {},
    create: { nombre: 'Gasolina' },
  });
  const diesel = await prisma.tipoCombustible.upsert({
    where: { nombre: 'Diésel' },
    update: {},
    create: { nombre: 'Diésel' },
  });
  const hibrido = await prisma.tipoCombustible.upsert({
    where: { nombre: 'Híbrido' },
    update: {},
    create: { nombre: 'Híbrido' },
  });
  const electrico = await prisma.tipoCombustible.upsert({
    where: { nombre: 'Eléctrico' },
    update: {},
    create: { nombre: 'Eléctrico' },
  });

  // ── 8. TRANSMISIONES ─────────────────────────────────────────
  const manual = await prisma.tipoTransmision.upsert({
    where: { nombre: 'Manual' },
    update: {},
    create: { nombre: 'Manual' },
  });
  const automatico = await prisma.tipoTransmision.upsert({
    where: { nombre: 'Automático' },
    update: {},
    create: { nombre: 'Automático' },
  });

  // ── 9. EXTRAS ────────────────────────────────────────────────
  await prisma.extraEquipamiento.upsert({
    where: { nombre: 'GPS' },
    update: {},
    create: { nombre: 'GPS', descripcion: 'Navegador GPS portátil', precioDia: 5.00 },
  });
  await prisma.extraEquipamiento.upsert({
    where: { nombre: 'Silla de bebé' },
    update: {},
    create: { nombre: 'Silla de bebé', descripcion: 'Silla de seguridad para niños', precioDia: 3.00 },
  });
  await prisma.extraEquipamiento.upsert({
    where: { nombre: 'WiFi portátil' },
    update: {},
    create: { nombre: 'WiFi portátil', descripcion: 'Router WiFi portátil ilimitado', precioDia: 4.00 },
  });
  await prisma.extraEquipamiento.upsert({
    where: { nombre: 'Seguro premium' },
    update: {},
    create: { nombre: 'Seguro premium', descripcion: 'Cobertura premium sin deducible', precioDia: 15.00 },
  });

  // ── 10. SEGUROS ──────────────────────────────────────────────
  const seguroBasico = await prisma.seguro.upsert({
    where: { nombre: 'Básico' },
    update: {},
    create: {
      nombre: 'Básico',
      descripcion: 'Cobertura de responsabilidad civil',
      precioDia: 5.00,
      cobertura: 'Daños a terceros hasta $10,000',
    },
  });
  await prisma.seguro.upsert({
    where: { nombre: 'Completo' },
    update: {},
    create: {
      nombre: 'Completo',
      descripcion: 'Cobertura total con deducible',
      precioDia: 12.00,
      cobertura: 'Daños propios y a terceros hasta $50,000',
    },
  });
  await prisma.seguro.upsert({
    where: { nombre: 'Premium' },
    update: {},
    create: {
      nombre: 'Premium',
      descripcion: 'Cobertura premium sin deducible',
      precioDia: 20.00,
      cobertura: 'Cobertura total sin deducible + asistencia 24/7',
    },
  });

  // ── 11. TARIFAS ──────────────────────────────────────────────
  await prisma.tarifa.upsert({
    where: { id: 'tar-economico-std' },
    update: {},
    create: {
      id: 'tar-economico-std',
      categoriaId: catEconomico.id,
      nombre: 'Estándar',
      precioDia: 35.00,
      diasMinimos: 1,
    },
  });
  await prisma.tarifa.upsert({
    where: { id: 'tar-sedan-std' },
    update: {},
    create: {
      id: 'tar-sedan-std',
      categoriaId: catSedan.id,
      nombre: 'Estándar',
      precioDia: 55.00,
      diasMinimos: 1,
    },
  });
  await prisma.tarifa.upsert({
    where: { id: 'tar-suv-std' },
    update: {},
    create: {
      id: 'tar-suv-std',
      categoriaId: catSuv.id,
      nombre: 'Estándar',
      precioDia: 80.00,
      diasMinimos: 1,
    },
  });
  await prisma.tarifa.upsert({
    where: { id: 'tar-pickup-std' },
    update: {},
    create: {
      id: 'tar-pickup-std',
      categoriaId: catPickup.id,
      nombre: 'Estándar',
      precioDia: 90.00,
      diasMinimos: 1,
    },
  });
  await prisma.tarifa.upsert({
    where: { id: 'tar-suv-finde' },
    update: {},
    create: {
      id: 'tar-suv-finde',
      categoriaId: catSuv.id,
      nombre: 'Fin de semana',
      precioDia: 70.00,
      diasMinimos: 2,
    },
  });
  await prisma.tarifa.upsert({
    where: { id: 'tar-sedan-corp' },
    update: {},
    create: {
      id: 'tar-sedan-corp',
      categoriaId: catSedan.id,
      nombre: 'Corporativa',
      precioDia: 48.00,
      diasMinimos: 5,
    },
  });

  // ── 12. CANALES DE VENTA ─────────────────────────────────────
  await prisma.canalVenta.upsert({
    where: { codigo: 'WEB' },
    update: {},
    create: { nombre: 'Web', codigo: 'WEB' },
  });
  await prisma.canalVenta.upsert({
    where: { codigo: 'APP' },
    update: {},
    create: { nombre: 'App móvil', codigo: 'APP' },
  });
  await prisma.canalVenta.upsert({
    where: { codigo: 'MOSTRADOR' },
    update: {},
    create: { nombre: 'Mostrador', codigo: 'MOSTRADOR' },
  });

  // ── 13. SISTEMAS EXTERNOS ────────────────────────────────────
  await prisma.sistemaExterno.upsert({
    where: { codigo: 'BOOKING_PROTO' },
    update: {},
    create: {
      nombre: 'Booking Prototipo',
      codigo: 'BOOKING_PROTO',
      url: 'https://booking-prototipo.example.com',
      isActive: false,
    },
  });
  await prisma.sistemaExterno.upsert({
    where: { codigo: 'APP_MOVIL' },
    update: {},
    create: {
      nombre: 'App Móvil',
      codigo: 'APP_MOVIL',
      isActive: false,
    },
  });

  // ── 14. USUARIOS ─────────────────────────────────────────────
  const adminPwd = await bcrypt.hash('Admin2025!', 10);
  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@rentcar.ec' },
    update: {},
    create: {
      email: 'admin@rentcar.ec',
      passwordHash: adminPwd,
      nombres: 'Administrador',
      apellidos: 'Sistema',
      role: UserRole.ADMIN,
      ciudadId: quito.id,
    },
  });

  const clientePwd = await bcrypt.hash('Cliente2025!', 10);
  const clienteUser = await prisma.usuario.upsert({
    where: { email: 'cliente@test.ec' },
    update: {},
    create: {
      email: 'cliente@test.ec',
      passwordHash: clientePwd,
      nombres: 'Juan',
      apellidos: 'Pérez',
      cedula: '1712345678',
      telefono: '+593 98 7654321',
      role: UserRole.CLIENTE,
      ciudadId: quito.id,
    },
  });

  await prisma.cliente.upsert({
    where: { usuarioId: clienteUser.id },
    update: {},
    create: {
      usuarioId: clienteUser.id,
      numeroLicencia: 'LIC-EC-123456',
      fechaVencLicencia: new Date('2027-06-30'),
    },
  });

  // ── 15. VEHÍCULOS DE PRUEBA ──────────────────────────────────
  const v1 = await prisma.vehiculo.upsert({
    where: { placa: 'PIC-1234' },
    update: {},
    create: {
      agenciaId: agQuitoNorte.id,
      modeloId: picanto.id,
      categoriaId: catEconomico.id,
      tipoCombustibleId: gasolina.id,
      tipoTransmisionId: manual.id,
      placa: 'PIC-1234',
      color: 'Blanco',
      anio: 2023,
      kilometraje: 12000,
      numeroPasajeros: 5,
      precioDia: 35.00,
      descripcion: 'Kia Picanto económico, ideal para ciudad',
      status: VehicleStatus.DISPONIBLE,
    },
  });

  const v2 = await prisma.vehiculo.upsert({
    where: { placa: 'PIC-5678' },
    update: {},
    create: {
      agenciaId: agQuitoNorte.id,
      modeloId: corolla.id,
      categoriaId: catSedan.id,
      tipoCombustibleId: gasolina.id,
      tipoTransmisionId: automatico.id,
      placa: 'PIC-5678',
      color: 'Plata',
      anio: 2024,
      kilometraje: 5000,
      numeroPasajeros: 5,
      precioDia: 55.00,
      descripcion: 'Toyota Corolla sedán automático',
      status: VehicleStatus.DISPONIBLE,
    },
  });

  await prisma.vehiculo.upsert({
    where: { placa: 'GUA-9999' },
    update: {},
    create: {
      agenciaId: agGye.id,
      modeloId: sportage.id,
      categoriaId: catSuv.id,
      tipoCombustibleId: gasolina.id,
      tipoTransmisionId: automatico.id,
      placa: 'GUA-9999',
      color: 'Negro',
      anio: 2024,
      kilometraje: 8000,
      numeroPasajeros: 5,
      precioDia: 80.00,
      descripcion: 'Kia Sportage SUV automático 4x4',
      status: VehicleStatus.DISPONIBLE,
    },
  });

  await prisma.vehiculo.upsert({
    where: { placa: 'GUA-0001' },
    update: {},
    create: {
      agenciaId: agGye.id,
      modeloId: dmax.id,
      categoriaId: catPickup.id,
      tipoCombustibleId: diesel.id,
      tipoTransmisionId: manual.id,
      placa: 'GUA-0001',
      color: 'Blanco',
      anio: 2022,
      kilometraje: 45000,
      numeroPasajeros: 5,
      precioDia: 90.00,
      descripcion: 'Chevrolet D-Max pickup diesel doble cabina',
      status: VehicleStatus.DISPONIBLE,
    },
  });

  await prisma.vehiculo.upsert({
    where: { placa: 'AZU-3322' },
    update: {},
    create: {
      agenciaId: agCuenca.id,
      modeloId: tucson.id,
      categoriaId: catSuv.id,
      tipoCombustibleId: hibrido.id,
      tipoTransmisionId: automatico.id,
      placa: 'AZU-3322',
      color: 'Azul',
      anio: 2025,
      kilometraje: 1500,
      numeroPasajeros: 5,
      precioDia: 85.00,
      descripcion: 'Hyundai Tucson Hybrid automático',
      status: VehicleStatus.DISPONIBLE,
    },
  });

  // ── 16. RESERVA DE PRUEBA ────────────────────────────────────
  const canalWeb = await prisma.canalVenta.findUnique({ where: { codigo: 'WEB' } });

  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() + 5);
  fechaInicio.setHours(0, 0, 0, 0);

  const fechaFin = new Date();
  fechaFin.setDate(fechaFin.getDate() + 8);
  fechaFin.setHours(0, 0, 0, 0);

  const reservaExistente = await prisma.reserva.findFirst({
    where: { usuarioId: clienteUser.id, vehiculoId: v1.id },
  });

  if (!reservaExistente) {
    await prisma.reserva.create({
      data: {
        usuarioId: clienteUser.id,
        vehiculoId: v1.id,
        agenciaId: agQuitoNorte.id,
        seguroId: seguroBasico.id,
        canalVentaId: canalWeb!.id,
        codigoReserva: 'RC-SEED-001',
        fechaInicio,
        fechaFin,
        diasTotal: 3,
        precioBase: 105.00,
        precioExtras: 0,
        precioSeguro: 15.00,
        totalAmount: 120.00,
        status: 'PENDIENTE',
        notas: 'Reserva de prueba generada por seed',
      },
    });
    console.log('✅ Reserva de prueba creada');
  }

  console.log('\n✅ Seed completado exitosamente:');
  console.log('   - 3 provincias, 3 ciudades');
  console.log('   - 2 empresas, 3 agencias');
  console.log('   - 4 marcas, 5 modelos, 4 categorías');
  console.log('   - 4 combustibles, 2 transmisiones');
  console.log('   - 4 extras, 3 seguros, 6 tarifas');
  console.log('   - 3 canales de venta, 2 sistemas externos');
  console.log('   - 1 admin, 1 cliente con perfil');
  console.log('   - 5 vehículos de prueba');
  console.log('   - 1 reserva de prueba');
  console.log('\n📧 Credenciales:');
  console.log('   Admin:   admin@rentcar.ec    / Admin2025!');
  console.log('   Cliente: cliente@test.ec     / Cliente2025!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
