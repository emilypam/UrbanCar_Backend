import { z } from 'zod';

// ── Patrones de expresiones regulares ─────────────────────────────────────────

export const REGEX = {
  /** Solo letras (incluye acentos y ñ del español) y espacios */
  SOLO_LETRAS:  /^[a-zA-ZÀ-ÿ\s]+$/,
  /** Solo dígitos */
  SOLO_DIGITOS: /^\d+$/,
  /** Cédula ecuatoriana: exactamente 10 dígitos */
  CEDULA_EC:    /^\d{10}$/,
  /** RUC ecuatoriano: exactamente 13 dígitos */
  RUC_EC:       /^\d{13}$/,
  /** Placa Ecuador: 2-3 letras + guión opcional + 3-4 dígitos + letra opcional (ej: ABC-1234) */
  PLACA_EC:     /^[A-Z]{2,3}-?\d{3,4}[A-Z]?$/,
  /** Teléfono: dígitos, espacios, +, -, paréntesis; 7-20 chars */
  TELEFONO:     /^[\d\s+()\-]{7,20}$/,
  /** Fecha YYYY-MM-DD */
  FECHA:        /^\d{4}-\d{2}-\d{2}$/,
  /** UUID estándar */
  UUID:         /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  /** Número de licencia: alfanumérico con guiones, 4-20 chars */
  LICENCIA:     /^[a-zA-Z0-9\-]{4,20}$/,
  /** Nombre de persona u organización: letras, dígitos, espacios y puntuación básica */
  NOMBRE_ORG:   /^[a-zA-ZÀ-ÿ0-9\s\-.&,()]+$/,
  /** Color: solo letras y espacios */
  COLOR:        /^[a-zA-ZÀ-ÿ\s]+$/,
} as const;

// ── Algoritmos de validación ecuatorianos ─────────────────────────────────────

/** Valida la cédula ecuatoriana con el algoritmo del módulo 10 */
export function esCedulaValida(cedula: string): boolean {
  if (!REGEX.CEDULA_EC.test(cedula)) return false;
  const prov = parseInt(cedula.substring(0, 2));
  if (prov < 1 || prov > 24) return false;
  const d = cedula.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let v = d[i] * (i % 2 === 0 ? 2 : 1);
    if (v > 9) v -= 9;
    sum += v;
  }
  const mod = sum % 10;
  return (mod === 0 ? 0 : 10 - mod) === d[9];
}

/** Valida el RUC ecuatoriano básicamente (13 dígitos, establecimiento > 0) */
export function esRucValido(ruc: string): boolean {
  if (!REGEX.RUC_EC.test(ruc)) return false;
  return parseInt(ruc.substring(10)) > 0;
}

// ── Schemas Zod reutilizables ─────────────────────────────────────────────────

/** Nombres o apellidos: solo letras y espacios */
export const zSoloLetras = (campo: string, min = 2, max = 100) =>
  z.string().trim()
    .min(min, `${campo} debe tener al menos ${min} caracteres`)
    .max(max, `${campo} no puede superar ${max} caracteres`)
    .regex(REGEX.SOLO_LETRAS, `${campo} solo puede contener letras (sin números ni símbolos)`);

/** Nombre de empresa, agencia u organización */
export const zNombreOrg = (campo = 'El nombre', min = 2, max = 150) =>
  z.string().trim()
    .min(min, `${campo} debe tener al menos ${min} caracteres`)
    .max(max, `${campo} no puede superar ${max} caracteres`)
    .regex(REGEX.NOMBRE_ORG, `${campo} contiene caracteres no permitidos`);

/** Color de vehículo: solo letras */
export const zColor = z.string().trim()
  .min(2, 'El color debe tener al menos 2 caracteres')
  .max(50, 'El color no puede superar 50 caracteres')
  .regex(REGEX.COLOR, 'El color solo puede contener letras');

/** Teléfono opcional (acepta vacío o undefined) */
export const zTelefonoOpcional = z.string().trim().optional()
  .refine(
    v => !v || REGEX.TELEFONO.test(v),
    'Teléfono inválido: use solo dígitos, espacios y los símbolos + - ( ) (7-20 caracteres)',
  );

/** Cédula ecuatoriana opcional con algoritmo */
export const zCedulaOpcional = z.string().trim().optional()
  .refine(
    v => !v || (REGEX.CEDULA_EC.test(v) && esCedulaValida(v)),
    'Cédula ecuatoriana inválida: debe tener exactamente 10 dígitos',
  );

/** RUC ecuatoriano opcional */
export const zRucOpcional = z.string().trim().optional()
  .refine(
    v => !v || (REGEX.RUC_EC.test(v) && esRucValido(v)),
    'RUC ecuatoriano inválido: debe tener exactamente 13 dígitos',
  );

/** Placa ecuatoriana obligatoria (ej: ABC-1234) */
export const zPlacaEC = z.string().trim()
  .min(1, 'La placa es requerida')
  .max(10, 'La placa no puede superar 10 caracteres')
  .transform(v => v.toUpperCase().replace(/\s/g, ''))
  .refine(v => REGEX.PLACA_EC.test(v), 'Formato de placa inválido (ej: ABC-1234 o PBC-123)');

/** Fecha YYYY-MM-DD que no puede ser anterior a hoy */
export const zFechaHoyOFutura = (campo = 'La fecha') =>
  z.string()
    .regex(REGEX.FECHA, `${campo}: formato inválido (YYYY-MM-DD)`)
    .refine(v => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return new Date(v + 'T00:00:00') >= hoy;
    }, `${campo} no puede ser anterior a hoy`);

/** Fecha YYYY-MM-DD estrictamente futura (para vencimiento de licencias) */
export const zFechaFutura = (campo = 'La fecha') =>
  z.string()
    .regex(REGEX.FECHA, `${campo}: formato inválido (YYYY-MM-DD)`)
    .refine(
      v => new Date(v + 'T00:00:00') > new Date(),
      `${campo} debe ser una fecha futura`,
    );

/** Número de licencia alfanumérico */
export const zNumeroLicencia = z.string().trim()
  .min(4, 'El número de licencia debe tener al menos 4 caracteres')
  .max(20, 'El número de licencia no puede superar 20 caracteres')
  .regex(REGEX.LICENCIA, 'El número de licencia solo puede contener letras, dígitos y guiones');
