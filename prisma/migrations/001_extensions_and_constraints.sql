-- ============================================================
-- MIGRACIÓN COMPLEMENTARIA: Extensiones, Constraints y Triggers
-- Sistema de Alquiler de Autos — Reto 1
-- Ejecutar DESPUÉS de `prisma migrate dev` o `prisma db push`
-- ============================================================

-- ============================================================
-- 1. EXTENSIONES POSTGRESQL
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ============================================================
-- 2. CONSTRAINT ANTI-SOLAPAMIENTO DE RESERVAS
--    Regla: un vehículo no puede tener dos reservas activas,
--    pendientes o confirmadas con rangos de fechas solapados.
--    Estados CANCELADA y COMPLETADA no bloquean disponibilidad.
-- ============================================================

-- Primero eliminamos si ya existe (para re-ejecución segura)
ALTER TABLE reservas
  DROP CONSTRAINT IF EXISTS no_solapamiento_reservas;

ALTER TABLE reservas
  ADD CONSTRAINT no_solapamiento_reservas
  EXCLUDE USING gist (
    vehiculo_id WITH =,
    daterange(fecha_inicio, fecha_fin, '[]') WITH &&
  )
  WHERE (status IN ('PENDIENTE', 'CONFIRMADA', 'ACTIVA'));

-- ============================================================
-- 3. FUNCIÓN: Actualización automática de updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 4. FUNCIÓN: Generador de código de reserva
--    Formato: RC-YYYYMMDD-XXXXX (alfanumérico aleatorio)
-- ============================================================

CREATE OR REPLACE FUNCTION generate_codigo_reserva()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo_reserva IS NULL OR NEW.codigo_reserva = '' THEN
    NEW.codigo_reserva := 'RC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
      UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_reserva
  BEFORE INSERT ON reservas
  FOR EACH ROW
  EXECUTE FUNCTION generate_codigo_reserva();

-- ============================================================
-- 5. FUNCIÓN: Generador de número de factura
--    Formato: FAC-YYYY-NNNNNN (secuencial por año)
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS seq_factura_anio
  START 1
  INCREMENT 1
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

CREATE OR REPLACE FUNCTION generate_numero_factura()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_factura IS NULL OR NEW.numero_factura = '' THEN
    NEW.numero_factura := 'FAC-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
      LPAD(NEXTVAL('seq_factura_anio')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_numero_factura
  BEFORE INSERT ON facturas
  FOR EACH ROW
  EXECUTE FUNCTION generate_numero_factura();

-- ============================================================
-- 6. FUNCIÓN: Registro automático en Kardex al cambiar estado
--    del vehículo
-- ============================================================

CREATE OR REPLACE FUNCTION registrar_kardex_vehiculo()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo registrar si el status realmente cambió
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO kardex (
      id,
      vehiculo_id,
      evento,
      estado_anterior,
      estado_nuevo,
      referencia,
      created_at
    ) VALUES (
      uuid_generate_v4(),
      NEW.id,
      'CAMBIO_ESTADO',
      OLD.status::TEXT,
      NEW.status::TEXT,
      'SISTEMA_AUTOMATICO',
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kardex_vehiculo
  AFTER UPDATE OF status ON vehiculos
  FOR EACH ROW
  EXECUTE FUNCTION registrar_kardex_vehiculo();

-- ============================================================
-- 7. ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================================

-- Búsqueda de disponibilidad por rango de fechas y estado
CREATE INDEX IF NOT EXISTS idx_reservas_vehiculo_fechas_status
  ON reservas (vehiculo_id, fecha_inicio, fecha_fin, status);

-- Búsqueda de vehículos activos por agencia y categoría (marketplace)
CREATE INDEX IF NOT EXISTS idx_vehiculos_agencia_categoria_status
  ON vehiculos (agencia_id, categoria_id, status)
  WHERE is_active = true AND deleted_at IS NULL;

-- Búsqueda de eventos outbox pendientes (worker futuro)
CREATE INDEX IF NOT EXISTS idx_outbox_pendientes
  ON outbox_events (status, created_at)
  WHERE status = 'PENDIENTE';

-- Historial por entidad (auditoría)
CREATE INDEX IF NOT EXISTS idx_historial_entidad
  ON historial_usuarios (entidad, entidad_id, created_at DESC);

-- ============================================================
-- 8. VISTA: Disponibilidad de vehículos (helper para queries)
-- ============================================================

CREATE OR REPLACE VIEW v_vehiculos_disponibles AS
SELECT
  v.id,
  v.placa,
  v.color,
  v.anio,
  v.kilometraje,
  v.numero_pasajeros,
  v.precio_dia,
  v.imagen_url,
  v.descripcion,
  v.status,
  v.agencia_id,
  v.categoria_id,
  v.tipo_combustible_id,
  v.tipo_transmision_id,
  mo.nombre   AS modelo_nombre,
  ma.nombre   AS marca_nombre,
  cat.nombre  AS categoria_nombre,
  tc.nombre   AS combustible_nombre,
  tt.nombre   AS transmision_nombre,
  ag.nombre   AS agencia_nombre,
  ag.ciudad_id,
  ci.nombre   AS ciudad_nombre
FROM vehiculos v
JOIN modelos        mo  ON mo.id  = v.modelo_id
JOIN marcas         ma  ON ma.id  = mo.marca_id
JOIN categorias     cat ON cat.id = v.categoria_id
JOIN tipos_combustible tc ON tc.id = v.tipo_combustible_id
JOIN tipos_transmision tt ON tt.id = v.tipo_transmision_id
JOIN agencias       ag  ON ag.id  = v.agencia_id
JOIN ciudades       ci  ON ci.id  = ag.ciudad_id
WHERE v.is_active  = true
  AND v.deleted_at IS NULL
  AND v.status     = 'DISPONIBLE';

-- ============================================================
-- FIN DE MIGRACIÓN COMPLEMENTARIA
-- ============================================================
