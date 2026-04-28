export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'RentCar Ec — API de Alquiler de Autos',
    version: '1.0.0',
    description: `
## Bienvenido a la API de RentCar Ec

Sistema de alquiler de autos con arquitectura modular API-first.
Versión: **Reto 1 — Construcción base sin integración externa**.

---

### 🚀 Inicio rápido

1. **Login** → \`POST /api/v1/auth/login\`
2. Copia el campo \`data.token\` de la respuesta
3. Haz clic en **Authorize 🔒** (arriba a la derecha)
4. Pega el token en el campo **Value** → clic **Authorize** → **Close**

---

### 👤 Credenciales de prueba

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | \`admin@rentcar.ec\` | \`Admin2025!\` |
| **Cliente** | \`cliente@test.ec\` | \`Cliente2025!\` |

---

### 🔄 Flujo principal del negocio

\`\`\`
Registro → Login → Buscar vehículo → Crear reserva
→ Registrar pago → Iniciar alquiler → Devolver → Generar factura
\`\`\`

---

### 🏷️ Roles y permisos

- **Público** (sin token): marketplace, búsqueda, catálogos
- **Cliente** (token): crear reservas, ver mis reservas, cancelar
- **Admin** (token): gestión completa de todas las entidades

---

### ⚠️ Reglas de negocio críticas

- El backend **siempre recalcula** el total de una reserva (nunca confíes en el precio del frontend)
- **No se permiten reservas solapadas** para el mismo vehículo
- Reservas canceladas no bloquean disponibilidad
- Un cliente solo puede ver **sus propias reservas**
    `,
    contact: { name: 'RentCar Ec Dev', email: 'dev@rentcar.ec' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'https://rentcar-ec-api-f2bdb7e6f7akaneu.canadacentral-01.azurewebsites.net', description: '🌐 Producción (Azure)' },
    { url: 'http://localhost:3000', description: '🖥️  Desarrollo local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido en `POST /api/v1/auth/login`. Formato: `Bearer <token>`',
      },
    },
    schemas: {
      RegisterDto: {
        type: 'object',
        required: ['email', 'password', 'nombres', 'apellidos'],
        properties: {
          email:     { type: 'string', format: 'email', example: 'nuevo.usuario@test.ec' },
          password:  { type: 'string', minLength: 6, example: 'MiClave2026!' },
          nombres:   { type: 'string', example: 'Carlos' },
          apellidos: { type: 'string', example: 'Mendoza' },
          cedula:    { type: 'string', example: '1712345678' },
          telefono:  { type: 'string', example: '0991234567' },
          ciudadId:  { type: 'string', format: 'uuid', description: 'Opcional — UUID de ciudad del catálogo' },
        },
        example: {
          email: 'nuevo.usuario@test.ec',
          password: 'MiClave2026!',
          nombres: 'Carlos',
          apellidos: 'Mendoza',
          cedula: '1712345678',
          telefono: '0991234567',
        },
      },
      LoginDto: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email:    { type: 'string', format: 'email', example: 'admin@rentcar.ec' },
          password: { type: 'string', example: 'Admin2025!' },
        },
        example: { email: 'admin@rentcar.ec', password: 'Admin2025!' },
      },
      CreateClienteDto: {
        type: 'object',
        required: ['usuarioId', 'numeroLicencia', 'fechaVencLicencia'],
        properties: {
          usuarioId:         { type: 'string', description: 'UUID del usuario registrado' },
          numeroLicencia:    { type: 'string', example: 'LIC-EC-2026-001' },
          fechaVencLicencia: { type: 'string', format: 'date', example: '2028-06-30' },
        },
        example: {
          usuarioId: '0bf154fa-c0ff-4e09-b98f-59ba5a3de5ab',
          numeroLicencia: 'LIC-EC-2026-001',
          fechaVencLicencia: '2028-06-30',
        },
      },
      CreateReservaDto: {
        type: 'object',
        required: ['vehiculoId', 'fechaInicio', 'fechaFin'],
        properties: {
          vehiculoId:    { type: 'string', format: 'uuid', description: 'ID del vehículo a reservar' },
          fechaInicio:   { type: 'string', format: 'date', example: '2026-09-01', description: 'Fecha de inicio (YYYY-MM-DD)' },
          fechaFin:      { type: 'string', format: 'date', example: '2026-09-05', description: 'Fecha de fin (YYYY-MM-DD)' },
          seguroId:      { type: 'string', format: 'uuid', description: 'Opcional — UUID del seguro seleccionado' },
          tarifaId:      { type: 'string', format: 'uuid', description: 'Opcional — UUID de tarifa especial' },
          extras:        {
            type: 'array',
            description: 'Lista de extras seleccionados',
            items: {
              type: 'object',
              required: ['extraId', 'cantidad'],
              properties: {
                extraId:  { type: 'string', format: 'uuid' },
                cantidad: { type: 'integer', minimum: 1, example: 1 },
              },
            },
          },
          notas: { type: 'string', example: 'Llegamos al mediodía' },
        },
        example: {
          vehiculoId: '31f4ce3c-db82-4594-81ac-378b8acac395',
          fechaInicio: '2026-09-01',
          fechaFin: '2026-09-05',
          seguroId: '484cd69e-cb75-4c70-9070-1a78fcb0d1bb',
          extras: [{ extraId: '6b8206fe-9e85-4e8b-9b92-8ccee76e859e', cantidad: 1 }],
          notas: 'Llegamos al mediodía',
        },
      },
      CreateAlquilerDto: {
        type: 'object',
        required: ['reservaId', 'kmSalida'],
        properties: {
          reservaId:     { type: 'string', format: 'uuid', description: 'ID de reserva en estado CONFIRMADA' },
          kmSalida:      { type: 'number', example: 12500, description: 'Kilometraje actual del vehículo al salir' },
          observaciones: { type: 'string', example: 'Vehículo en perfectas condiciones' },
        },
        example: {
          reservaId: '<uuid-reserva-confirmada>',
          kmSalida: 12500,
          observaciones: 'Vehículo en perfectas condiciones',
        },
      },
      CreateDevolucionDto: {
        type: 'object',
        required: ['alquilerId', 'kmEntrada', 'estadoVehiculo'],
        properties: {
          alquilerId:     { type: 'string', format: 'uuid', description: 'ID del alquiler activo' },
          kmEntrada:      { type: 'number', example: 12850, description: 'Kilometraje al momento de la devolución' },
          estadoVehiculo: {
            type: 'string',
            enum: ['EXCELENTE', 'BUENO', 'REGULAR', 'DAÑADO'],
            example: 'BUENO',
            description: 'Estado visual del vehículo al regresar',
          },
          cargoExtra:     { type: 'number', example: 0, description: 'Cargo adicional si aplica (daños, combustible, etc.)' },
          observaciones:  { type: 'string', example: 'Sin novedad' },
        },
        example: {
          alquilerId: '<uuid-alquiler-activo>',
          kmEntrada: 12850,
          estadoVehiculo: 'BUENO',
          cargoExtra: 0,
          observaciones: 'Sin novedad',
        },
      },
      CreatePagoDto: {
        type: 'object',
        required: ['reservaId', 'monto', 'metodoPago'],
        properties: {
          reservaId:  { type: 'string', format: 'uuid', description: 'ID de la reserva a pagar' },
          monto:      { type: 'number', example: 220.00, description: 'Monto total a pagar (debe cubrir el total de la reserva)' },
          metodoPago: {
            type: 'string',
            enum: ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'PAYPAL'],
            example: 'TARJETA_CREDITO',
          },
        },
        example: {
          reservaId: '<uuid-reserva>',
          monto: 220.00,
          metodoPago: 'TARJETA_CREDITO',
        },
      },
      CreateFacturaDto: {
        type: 'object',
        required: ['reservaId'],
        properties: {
          reservaId:     { type: 'string', format: 'uuid', description: 'ID de la reserva pagada' },
          observaciones: { type: 'string', example: 'Factura correspondiente al alquiler de septiembre 2026' },
        },
        example: {
          reservaId: '<uuid-reserva-pagada>',
          observaciones: 'Factura correspondiente al alquiler de septiembre 2026',
        },
      },
      CreateVehiculoDto: {
        type: 'object',
        required: ['placa', 'color', 'anio', 'precioDia', 'modeloId', 'categoriaId', 'agenciaId', 'tipoCombustibleId', 'tipoTransmisionId'],
        properties: {
          placa:             { type: 'string', example: 'QUI-1234', description: 'Placa única del vehículo' },
          color:             { type: 'string', example: 'Blanco' },
          anio:              { type: 'integer', example: 2023, minimum: 1990 },
          kilometraje:       { type: 'integer', example: 0, minimum: 0, default: 0 },
          precioDia:         { type: 'number', example: 55.00, description: 'Precio por día en USD' },
          numeroPasajeros:   { type: 'integer', example: 5, minimum: 1, maximum: 20, default: 5 },
          descripcion:       { type: 'string', example: 'Toyota Corolla automático, aire acondicionado' },
          modeloId:          { type: 'string', format: 'uuid', description: 'UUID obtenido de GET /api/v1/modelos', example: 'ad604f3c-66cb-436c-b67f-36dda9f6fbde' },
          categoriaId:       { type: 'string', format: 'uuid', description: 'UUID obtenido de GET /api/v1/categorias', example: '772e53f9-c302-4734-bf00-d8a96049e88c' },
          agenciaId:         { type: 'string', description: 'ID de la agencia (ej: ag-quito-norte-001)', example: 'ag-quito-norte-001' },
          tipoCombustibleId: { type: 'string', format: 'uuid', description: 'UUID obtenido de GET /api/v1/tipos-combustible', example: '562ce0dc-3090-419e-9752-92ffc92df14e' },
          tipoTransmisionId: { type: 'string', format: 'uuid', description: 'UUID obtenido de GET /api/v1/tipos-transmision', example: '5ed4e7b4-f07b-4577-91ed-74885b3917e0' },
        },
        example: {
          placa: 'QUI-1234',
          color: 'Blanco',
          anio: 2023,
          kilometraje: 0,
          precioDia: 55.00,
          numeroPasajeros: 5,
          descripcion: 'Toyota Corolla automático, aire acondicionado',
          modeloId: 'ad604f3c-66cb-436c-b67f-36dda9f6fbde',
          categoriaId: '772e53f9-c302-4734-bf00-d8a96049e88c',
          agenciaId: 'ag-quito-norte-001',
          tipoCombustibleId: '562ce0dc-3090-419e-9752-92ffc92df14e',
          tipoTransmisionId: '5ed4e7b4-f07b-4577-91ed-74885b3917e0',
        },
      },
      UpdateVehiculoDto: {
        type: 'object',
        description: 'Todos los campos son opcionales — envía solo los que deseas modificar',
        properties: {
          placa:             { type: 'string', example: 'QUI-1234' },
          color:             { type: 'string', example: 'Negro' },
          anio:              { type: 'integer', example: 2024 },
          kilometraje:       { type: 'integer', example: 5000 },
          precioDia:         { type: 'number', example: 65.00 },
          numeroPasajeros:   { type: 'integer', example: 5 },
          descripcion:       { type: 'string' },
          status:            { type: 'string', enum: ['DISPONIBLE', 'RESERVADO', 'EN_USO', 'MANTENIMIENTO', 'INACTIVO'], example: 'DISPONIBLE' },
          isActive:          { type: 'boolean', example: true },
        },
        example: { precioDia: 65.00, descripcion: 'Vehículo revisado y actualizado' },
      },
      CreateAgenciaDto: {
        type: 'object',
        required: ['nombre', 'direccion', 'empresaId', 'ciudadId'],
        properties: {
          nombre:    { type: 'string', example: 'Quito Sur' },
          direccion: { type: 'string', example: 'Av. Maldonado y Morán Valverde' },
          telefono:  { type: 'string', example: '+593 2 2999888' },
          email:     { type: 'string', example: 'quitosur@rentcarecuador.com' },
          empresaId: { type: 'string', format: 'uuid', description: 'UUID de GET /api/v1/empresas', example: 'ae6c6b93-b12b-43ec-af54-c882c2cfb3d8' },
          ciudadId:  { type: 'string', format: 'uuid', description: 'UUID de GET /api/v1/catalogos/ciudades', example: '3e266dbf-040f-46ed-b530-420b737a16fa' },
        },
        example: {
          nombre: 'Quito Sur',
          direccion: 'Av. Maldonado y Morán Valverde',
          telefono: '+593 2 2999888',
          email: 'quitosur@rentcarecuador.com',
          empresaId: 'ae6c6b93-b12b-43ec-af54-c882c2cfb3d8',
          ciudadId: '3e266dbf-040f-46ed-b530-420b737a16fa',
        },
      },
      CreateEmpresaDto: {
        type: 'object',
        required: ['nombre', 'ruc'],
        properties: {
          nombre:   { type: 'string', example: 'SpeedRent Ecuador' },
          ruc:      { type: 'string', example: '1791111111001', description: 'RUC único de la empresa (13 dígitos)' },
          email:    { type: 'string', example: 'info@speedrent.ec' },
          telefono: { type: 'string', example: '+593 2 3333333' },
        },
        example: {
          nombre: 'SpeedRent Ecuador',
          ruc: '1791111111001',
          email: 'info@speedrent.ec',
          telefono: '+593 2 3333333',
        },
      },
      UpdateReservaStatusDto: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['PENDIENTE', 'CONFIRMADA', 'ACTIVA', 'COMPLETADA', 'CANCELADA'],
            example: 'CONFIRMADA',
            description: 'Nuevo estado de la reserva',
          },
        },
        example: { status: 'CONFIRMADA' },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data:    { type: 'object', description: 'Datos de respuesta' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code:    { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Datos de entrada inválidos' },
            },
          },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: '🔒 No autenticado — incluye el token Bearer en el header Authorization',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Forbidden: {
        description: '🚫 Sin permisos — se requiere rol ADMIN',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      NotFound: {
        description: '❌ Recurso no encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      Conflict: {
        description: '⚠️ Conflicto — el dato ya existe (unicidad violada)',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ValidationError: {
        description: '🔴 Error de validación — revisa los campos requeridos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Auth',           description: '🔐 Autenticación, registro y perfil de usuario' },
    { name: 'Vehículos',      description: '🚗 Gestión de flota — CRUD, marketplace y búsqueda por disponibilidad' },
    { name: 'Agencias',       description: '🏢 Sucursales de alquiler (agencias)' },
    { name: 'Empresas',       description: '🏦 Empresas propietarias de flotas' },
    { name: 'Catálogos',      description: '📋 Datos de referencia — marcas, modelos, categorías, combustibles, extras, seguros, tarifas' },
    { name: 'Clientes',       description: '👤 Perfiles de conductores (licencia + usuario)' },
    { name: 'Usuarios',       description: '👥 Gestión de cuentas de usuario (admin)' },
    { name: 'Reservas',       description: '📅 Reservas de vehículos — creación, consulta y cancelación' },
    { name: 'Alquileres',     description: '🔑 Inicio del alquiler desde una reserva confirmada' },
    { name: 'Devoluciones',   description: '↩️  Registro de devolución del vehículo' },
    { name: 'Pagos',          description: '💳 Registro y consulta de pagos' },
    { name: 'Facturas',       description: '🧾 Generación y consulta de facturas' },
    { name: 'Mantenimientos', description: '🔧 Gestión de mantenimientos de vehículos' },
    { name: 'Auditoría',      description: '📊 Historial de acciones, Kardex de vehículos y Outbox de eventos EDA' },
  ],
  paths: {

    // ── Auth ─────────────────────────────────────────────────────
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar nuevo usuario',
        description: 'Crea una cuenta con rol **CLIENTE** por defecto. El email y la cédula deben ser únicos.',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterDto' } } },
        },
        responses: {
          201: { description: '✅ Usuario creado — retorna `user` y `token` JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          409: { $ref: '#/components/responses/Conflict' },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        description: 'Autentica al usuario y retorna un **token JWT**. Copia `data.token` y úsalo en el botón **Authorize 🔒**.',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginDto' } } },
        },
        responses: {
          200: { description: '✅ Login exitoso — retorna `user` y `token`', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
          401: { description: '🔒 Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Ver mi perfil',
        description: 'Retorna los datos del usuario autenticado, incluyendo ciudad y provincia.',
        responses: {
          200: { description: '✅ Datos del usuario autenticado' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      patch: {
        tags: ['Auth'],
        summary: 'Actualizar mi perfil',
        description: 'El usuario autenticado puede actualizar su propio nombre, teléfono y ciudad.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombres:   { type: 'string', example: 'Carlos Alberto' },
                  apellidos: { type: 'string', example: 'Mendoza Vega' },
                  telefono:  { type: 'string', example: '0987654321' },
                  ciudadId:  { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: '✅ Perfil actualizado' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Vehículos ─────────────────────────────────────────────────
    '/api/v1/vehiculos': {
      get: {
        tags: ['Vehículos'],
        summary: 'Listar todos los vehículos',
        description: 'Lista completa de vehículos con relaciones (modelo, marca, categoría, agencia). **Solo admin.**',
        parameters: [
          { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200:  { description: '✅ Lista de vehículos' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Vehículos'],
        summary: 'Crear vehículo',
        description: 'Registra un nuevo vehículo en la flota. **Solo admin.** Obtén los UUIDs de los catálogos antes de llamar este endpoint.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVehiculoDto' } } },
        },
        responses: {
          201: { description: '✅ Vehículo creado' },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/Conflict' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/vehiculos/marketplace': {
      get: {
        tags: ['Vehículos'],
        summary: 'Marketplace público',
        description: '**Público (sin token).** Retorna todos los vehículos activos con información de agencia, empresa, categoría y precio.',
        security: [],
        responses: {
          200: { description: '✅ Vehículos disponibles para el marketplace' },
        },
      },
    },
    '/api/v1/vehiculos/search': {
      get: {
        tags: ['Vehículos'],
        summary: 'Buscar vehículos por disponibilidad',
        description: '**Público.** Filtra vehículos que NO tengan reservas activas/confirmadas en el rango de fechas indicado.',
        security: [],
        parameters: [
          { name: 'fechaInicio', in: 'query', required: true,  schema: { type: 'string', format: 'date', example: '2026-09-01' }, description: 'Fecha inicio en formato YYYY-MM-DD' },
          { name: 'fechaFin',    in: 'query', required: true,  schema: { type: 'string', format: 'date', example: '2026-09-05' }, description: 'Fecha fin en formato YYYY-MM-DD' },
          { name: 'agenciaId',   in: 'query', required: false, schema: { type: 'string' }, description: 'Filtrar por agencia (ej: ag-quito-norte-001)' },
          { name: 'categoriaId', in: 'query', required: false, schema: { type: 'string', format: 'uuid' }, description: 'Filtrar por categoría' },
        ],
        responses: {
          200: { description: '✅ Vehículos disponibles en el rango de fechas' },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/v1/vehiculos/{id}': {
      get: {
        tags: ['Vehículos'],
        summary: 'Detalle de vehículo',
        description: 'Retorna un vehículo con todos sus datos relacionados.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Vehículo encontrado' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Vehículos'],
        summary: 'Actualizar vehículo',
        description: 'Actualiza parcialmente los datos de un vehículo. **Solo admin.** Todos los campos son opcionales.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateVehiculoDto' } } },
        },
        responses: {
          200:  { description: '✅ Vehículo actualizado' },
          404:  { $ref: '#/components/responses/NotFound' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Vehículos'],
        summary: 'Eliminar vehículo (soft delete)',
        description: 'Marca el vehículo como eliminado. **Solo admin.**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Vehículo eliminado' },
          404:  { $ref: '#/components/responses/NotFound' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Agencias ──────────────────────────────────────────────────
    '/api/v1/agencias': {
      get: {
        tags: ['Agencias'],
        summary: 'Listar agencias',
        description: 'Lista todas las agencias con empresa y ciudad. **Solo admin.**',
        responses: {
          200: { description: '✅ Lista de agencias' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Agencias'],
        summary: 'Crear agencia',
        description: 'Registra una nueva sucursal. **Solo admin.** Requiere `empresaId` y `ciudadId` válidos.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAgenciaDto' } } },
        },
        responses: {
          201: { description: '✅ Agencia creada' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/agencias/{id}': {
      get: {
        tags: ['Agencias'],
        summary: 'Detalle de agencia',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200:  { description: '✅ Agencia encontrada' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Agencias'],
        summary: 'Actualizar agencia',
        description: '**Solo admin.**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAgenciaDto' } } },
        },
        responses: {
          200:  { description: '✅ Agencia actualizada' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Agencias'],
        summary: 'Eliminar agencia',
        description: '**Solo admin.**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200:  { description: '✅ Eliminada' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Empresas ──────────────────────────────────────────────────
    '/api/v1/empresas': {
      get: {
        tags: ['Empresas'],
        summary: 'Listar empresas',
        description: '**Solo admin.**',
        responses: {
          200: { description: '✅ Lista de empresas' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Empresas'],
        summary: 'Crear empresa',
        description: 'Registra una nueva empresa propietaria de flota. **Solo admin.** El RUC debe ser único.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateEmpresaDto' } } },
        },
        responses: {
          201: { description: '✅ Empresa creada' },
          409: { $ref: '#/components/responses/Conflict' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/empresas/{id}': {
      get: {
        tags: ['Empresas'],
        summary: 'Detalle de empresa',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Empresa encontrada' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Empresas'],
        summary: 'Actualizar empresa',
        description: '**Solo admin.**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateEmpresaDto' } } },
        },
        responses: {
          200:  { description: '✅ Actualizada' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Empresas'],
        summary: 'Eliminar empresa',
        description: '**Solo admin.**',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Eliminada' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Reservas ──────────────────────────────────────────────────
    '/api/v1/reservas': {
      get: {
        tags: ['Reservas'],
        summary: 'Listar todas las reservas',
        description: '**Solo admin.** Lista completa. Para ver solo las propias usa `GET /reservas/my`.',
        responses: {
          200:  { description: '✅ Lista de reservas' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Reservas'],
        summary: 'Crear reserva',
        description: 'Crea una nueva reserva. El backend valida disponibilidad del vehículo en el rango de fechas y **recalcula el total** automáticamente.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateReservaDto' } } },
        },
        responses: {
          201: { description: '✅ Reserva creada — se registra evento `RESERVA_CREADA` en outbox' },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { description: '⚠️ Vehículo no disponible en las fechas solicitadas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/reservas/my': {
      get: {
        tags: ['Reservas'],
        summary: 'Mis reservas',
        description: 'El cliente autenticado ve **solo sus propias reservas**. Los admins ven todas en `GET /reservas`.',
        responses: {
          200:  { description: '✅ Reservas del cliente autenticado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/reservas/{id}': {
      get: {
        tags: ['Reservas'],
        summary: 'Detalle de reserva',
        description: 'El cliente solo puede ver sus propias reservas. El admin puede ver cualquiera.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Detalle de la reserva' },
          403:  { $ref: '#/components/responses/Forbidden' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Reservas'],
        summary: 'Cambiar estado de reserva',
        description: '**Solo admin.** Cambia manualmente el estado de una reserva.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateReservaStatusDto' } } },
        },
        responses: {
          200:  { description: '✅ Estado actualizado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/v1/reservas/{id}/cancel': {
      patch: {
        tags: ['Reservas'],
        summary: 'Cancelar reserva',
        description: 'El cliente puede cancelar sus propias reservas. Se registra evento `RESERVA_CANCELADA` en outbox. Las reservas canceladas no bloquean disponibilidad.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Reserva cancelada' },
          403:  { $ref: '#/components/responses/Forbidden' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Alquileres ────────────────────────────────────────────────
    '/api/v1/alquileres': {
      get: {
        tags: ['Alquileres'],
        summary: 'Listar alquileres',
        description: '**Solo admin.**',
        responses: {
          200:  { description: '✅ Lista de alquileres' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Alquileres'],
        summary: 'Iniciar alquiler',
        description: '**Solo admin.** Inicia el alquiler desde una reserva en estado `CONFIRMADA`. El vehículo cambia a `EN_USO`.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAlquilerDto' } } },
        },
        responses: {
          201: { description: '✅ Alquiler iniciado — evento `ALQUILER_INICIADO` en outbox' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/alquileres/{id}': {
      get: {
        tags: ['Alquileres'],
        summary: 'Detalle de alquiler',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Alquiler encontrado' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Devoluciones ──────────────────────────────────────────────
    '/api/v1/devoluciones': {
      get: {
        tags: ['Devoluciones'],
        summary: 'Listar devoluciones',
        description: '**Solo admin.**',
        responses: {
          200:  { description: '✅ Lista de devoluciones' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Devoluciones'],
        summary: 'Registrar devolución',
        description: '**Solo admin.** Registra la entrega del vehículo. El vehículo vuelve a `DISPONIBLE`, el alquiler pasa a `FINALIZADO` y la reserva a `COMPLETADA`.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateDevolucionDto' } } },
        },
        responses: {
          201: { description: '✅ Devolución registrada — evento `VEHICULO_DEVUELTO` en outbox' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/devoluciones/{id}': {
      get: {
        tags: ['Devoluciones'],
        summary: 'Detalle de devolución',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Devolución encontrada' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Pagos ─────────────────────────────────────────────────────
    '/api/v1/pagos': {
      get: {
        tags: ['Pagos'],
        summary: 'Listar pagos',
        description: '**Solo admin.**',
        responses: {
          200:  { description: '✅ Lista de pagos' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Pagos'],
        summary: 'Registrar pago',
        description: 'Registra el pago de una reserva. El monto debe cubrir el total calculado. Se emite evento `PAGO_REGISTRADO` en outbox.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePagoDto' } } },
        },
        responses: {
          201: { description: '✅ Pago registrado' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/pagos/{id}': {
      get: {
        tags: ['Pagos'],
        summary: 'Detalle de pago',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Pago encontrado' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Facturas ──────────────────────────────────────────────────
    '/api/v1/facturas': {
      get: {
        tags: ['Facturas'],
        summary: 'Listar facturas',
        description: '**Solo admin.**',
        responses: {
          200:  { description: '✅ Lista de facturas' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Facturas'],
        summary: 'Generar factura',
        description: 'Genera la factura para una reserva pagada. Se emite evento `FACTURA_GENERADA` en outbox.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateFacturaDto' } } },
        },
        responses: {
          201: { description: '✅ Factura generada' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/facturas/{id}': {
      get: {
        tags: ['Facturas'],
        summary: 'Detalle de factura',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Factura encontrada' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Clientes ──────────────────────────────────────────────────
    '/api/v1/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        description: 'Lista todos los perfiles de conductor registrados. **Solo admin.**',
        security: [{ bearerAuth: [] }],
        responses: {
          200:  { description: '✅ Lista de clientes con datos del usuario' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Registrar perfil de conductor',
        description: '**Solo admin.** Asocia datos de licencia a un usuario ya registrado. Primero crea el usuario con `POST /auth/register` y obtén su `id`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClienteDto' } } },
        },
        responses: {
          201: { description: '✅ Perfil de conductor creado' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/clientes/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Detalle de cliente',
        description: '**Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Cliente con datos de usuario' },
          404:  { $ref: '#/components/responses/NotFound' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      patch: {
        tags: ['Clientes'],
        summary: 'Actualizar datos de licencia',
        description: '**Solo admin.** Actualiza número de licencia y/o fecha de vencimiento.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  numeroLicencia:    { type: 'string', example: 'LIC-EC-2027-001' },
                  fechaVencLicencia: { type: 'string', format: 'date', example: '2029-12-31' },
                },
              },
            },
          },
        },
        responses: {
          200:  { description: '✅ Cliente actualizado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Eliminar cliente',
        description: '**Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Eliminado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Usuarios ──────────────────────────────────────────────────
    '/api/v1/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        description: 'Lista paginada de todos los usuarios. **Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200:  { description: '✅ Lista paginada de usuarios (sin passwordHash)' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/usuarios/{id}': {
      get: {
        tags: ['Usuarios'],
        summary: 'Detalle de usuario',
        description: '**Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Usuario encontrado' },
          404:  { $ref: '#/components/responses/NotFound' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      patch: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        description: '**Solo admin.** Puede activar/desactivar cuentas con `isActive`.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombres:   { type: 'string' },
                  apellidos: { type: 'string' },
                  telefono:  { type: 'string' },
                  isActive:  { type: 'boolean', description: '`false` = desactiva la cuenta (no puede hacer login)' },
                },
              },
              example: { isActive: true, telefono: '0987654321' },
            },
          },
        },
        responses: {
          200:  { description: '✅ Usuario actualizado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Desactivar usuario (soft delete)',
        description: '**Solo admin.** No elimina el registro, solo desactiva la cuenta.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Cuenta desactivada' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Mantenimientos ────────────────────────────────────────────
    '/api/v1/mantenimientos': {
      get: {
        tags: ['Mantenimientos'],
        summary: 'Listar mantenimientos',
        description: 'Lista paginada. **Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200:  { description: '✅ Lista de mantenimientos' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Mantenimientos'],
        summary: 'Registrar mantenimiento',
        description: '**Solo admin.** Al crear, el vehículo cambia automáticamente a estado `MANTENIMIENTO`.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['vehiculoId', 'tipo', 'descripcion', 'fechaInicio'],
                properties: {
                  vehiculoId:  { type: 'string', format: 'uuid', description: 'UUID del vehículo' },
                  tipo:        { type: 'string', enum: ['PREVENTIVO', 'CORRECTIVO', 'REVISION'], example: 'PREVENTIVO' },
                  descripcion: { type: 'string', example: 'Cambio de aceite y filtros' },
                  fechaInicio: { type: 'string', format: 'date', example: '2026-05-01' },
                  fechaFin:    { type: 'string', format: 'date', example: '2026-05-03' },
                  costo:       { type: 'number', example: 85.00 },
                  tecnico:     { type: 'string', example: 'Carlos Técnico' },
                },
              },
              example: {
                vehiculoId: '<uuid-vehiculo>',
                tipo: 'PREVENTIVO',
                descripcion: 'Cambio de aceite y filtros',
                fechaInicio: '2026-05-01',
                fechaFin: '2026-05-03',
                costo: 85.00,
                tecnico: 'Carlos Técnico',
              },
            },
          },
        },
        responses: {
          201: { description: '✅ Mantenimiento registrado — vehículo cambia a MANTENIMIENTO' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/mantenimientos/{id}': {
      get: {
        tags: ['Mantenimientos'],
        summary: 'Detalle de mantenimiento',
        description: '**Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Mantenimiento encontrado' },
          404:  { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Mantenimientos'],
        summary: 'Actualizar / Finalizar mantenimiento',
        description: '**Solo admin.** Envía `isActive: false` para finalizar — el vehículo vuelve a `DISPONIBLE` automáticamente.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  isActive:    { type: 'boolean', example: false, description: '`false` = finalizar mantenimiento, restaura vehículo a DISPONIBLE' },
                  fechaFin:    { type: 'string', format: 'date', example: '2026-05-03' },
                  costo:       { type: 'number', example: 95.00 },
                },
              },
              example: { isActive: false, fechaFin: '2026-05-03', costo: 95.00 },
            },
          },
        },
        responses: {
          200:  { description: '✅ Mantenimiento actualizado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
      delete: {
        tags: ['Mantenimientos'],
        summary: 'Eliminar mantenimiento',
        description: '**Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Eliminado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/mantenimientos/vehiculo/{vehiculoId}': {
      get: {
        tags: ['Mantenimientos'],
        summary: 'Historial de mantenimientos por vehículo',
        description: '**Solo admin.**',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'vehiculoId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200:  { description: '✅ Lista de mantenimientos del vehículo' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Auditoría ─────────────────────────────────────────────────
    '/api/v1/historial': {
      get: {
        tags: ['Auditoría'],
        summary: 'Historial de acciones de usuarios',
        description: '**Solo admin.** Registro de acciones críticas del sistema.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200:  { description: '✅ Historial paginado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/kardex': {
      get: {
        tags: ['Auditoría'],
        summary: 'Kardex de vehículos',
        description: '**Solo admin.** Registro de cambios de estado de cada vehículo.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200:  { description: '✅ Kardex paginado' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/v1/outbox-events': {
      get: {
        tags: ['Auditoría'],
        summary: 'Eventos de dominio (Outbox / EDA)',
        description: '**Solo admin.** Eventos registrados para futura integración con mensajería (RabbitMQ, Kafka, etc.). Eventos: `RESERVA_CREADA`, `RESERVA_CANCELADA`, `PAGO_REGISTRADO`, `ALQUILER_INICIADO`, `VEHICULO_DEVUELTO`, `FACTURA_GENERADA`.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page',  in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200:  { description: '✅ Eventos outbox paginados' },
          401:  { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Catálogos ─────────────────────────────────────────────────
    '/api/v1/marcas':            { get: { tags: ['Catálogos'], summary: 'Marcas de vehículos',      security: [], responses: { 200: { description: '✅ Lista (Toyota, Chevrolet, Kia, Hyundai…)' } } } },
    '/api/v1/modelos':           { get: { tags: ['Catálogos'], summary: 'Modelos de vehículos',     security: [], responses: { 200: { description: '✅ Lista con marca incluida' } } } },
    '/api/v1/categorias':        { get: { tags: ['Catálogos'], summary: 'Categorías de vehículo',   security: [], responses: { 200: { description: '✅ Económico, Sedán, SUV, Pickup…' } } } },
    '/api/v1/tipos-combustible': { get: { tags: ['Catálogos'], summary: 'Tipos de combustible',     security: [], responses: { 200: { description: '✅ Gasolina, Diésel, Híbrido, Eléctrico' } } } },
    '/api/v1/tipos-transmision': { get: { tags: ['Catálogos'], summary: 'Tipos de transmisión',     security: [], responses: { 200: { description: '✅ Manual, Automático' } } } },
    '/api/v1/estados-vehiculo':  { get: { tags: ['Catálogos'], summary: 'Estados de vehículo',      security: [], responses: { 200: { description: '✅ DISPONIBLE | RESERVADO | EN_USO | MANTENIMIENTO | INACTIVO' } } } },
    '/api/v1/extras':            { get: { tags: ['Catálogos'], summary: 'Extras disponibles',        security: [], responses: { 200: { description: '✅ GPS, Silla de bebé, WiFi portátil…' } } } },
    '/api/v1/seguros':           { get: { tags: ['Catálogos'], summary: 'Seguros disponibles',       security: [], responses: { 200: { description: '✅ Básico, Completo, Premium' } } } },
    '/api/v1/tarifas':           { get: { tags: ['Catálogos'], summary: 'Tarifas especiales',        security: [], responses: { 200: { description: '✅ Estándar, Fin de semana, Corporativa' } } } },
    '/api/v1/canales-venta':     { get: { tags: ['Catálogos'], summary: 'Canales de venta',          security: [], responses: { 200: { description: '✅ Web, App móvil, Mostrador' } } } },
    '/api/v1/catalogos/provincias': { get: { tags: ['Catálogos'], summary: 'Provincias',             security: [], responses: { 200: { description: '✅ Pichincha, Guayas, Azuay…' } } } },
    '/api/v1/catalogos/ciudades':   { get: { tags: ['Catálogos'], summary: 'Ciudades',               security: [], responses: { 200: { description: '✅ Quito, Guayaquil, Cuenca…' } } } },
    '/api/v1/catalogos/marcas':             { get: { tags: ['Catálogos'], summary: 'Marcas (alias /catalogos)',            security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/modelos':            { get: { tags: ['Catálogos'], summary: 'Modelos (alias /catalogos)',           security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/categorias':         { get: { tags: ['Catálogos'], summary: 'Categorías (alias /catalogos)',        security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/tipos-combustible':  { get: { tags: ['Catálogos'], summary: 'Tipos combustible (alias /catalogos)', security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/tipos-transmision':  { get: { tags: ['Catálogos'], summary: 'Tipos transmisión (alias /catalogos)', security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/extras':             { get: { tags: ['Catálogos'], summary: 'Extras (alias /catalogos)',            security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/seguros':            { get: { tags: ['Catálogos'], summary: 'Seguros (alias /catalogos)',           security: [], responses: { 200: { description: '✅ Lista' } } } },
    '/api/v1/catalogos/tarifas':            { get: { tags: ['Catálogos'], summary: 'Tarifas (alias /catalogos)',           security: [], responses: { 200: { description: '✅ Lista' } } } },
  },
};
