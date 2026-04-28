import { z } from 'zod';
import { zPlacaEC, zColor } from '../../shared/utils/validation.utils.js';

const currentYear = new Date().getFullYear();

export const CreateVehiculoSchema = z.object({
  placa:             zPlacaEC,
  color:             zColor,
  anio:              z.number({
                       required_error:    'El año es requerido',
                       invalid_type_error: 'El año debe ser un número entero',
                     })
                     .int('El año debe ser un número entero (sin decimales)')
                     .min(1990,           'El año no puede ser anterior a 1990')
                     .max(currentYear + 1, `El año no puede superar ${currentYear + 1}`),
  kilometraje:       z.number({ invalid_type_error: 'El kilometraje debe ser un número entero' })
                     .int('El kilometraje debe ser un número entero (sin decimales)')
                     .min(0, 'El kilometraje no puede ser negativo')
                     .default(0),
  precioDia:         z.number({
                       required_error:    'El precio por día es requerido',
                       invalid_type_error: 'El precio debe ser un número',
                     })
                     .positive('El precio por día debe ser mayor a 0')
                     .max(10_000, 'El precio por día no puede superar $10,000'),
  numeroPasajeros:   z.number({ invalid_type_error: 'El número de pasajeros debe ser un entero' })
                     .int('El número de pasajeros debe ser un entero')
                     .min(1,  'Debe haber al menos 1 pasajero')
                     .max(20, 'El número de pasajeros no puede superar 20')
                     .default(5),
  descripcion:       z.string().trim().max(500, 'La descripción no puede superar 500 caracteres').optional(),
  modeloId:          z.string().uuid('ID de modelo inválido'),
  categoriaId:       z.string().uuid('ID de categoría inválido'),
  agenciaId:         z.string().min(1, 'La agencia es requerida'),
  tipoCombustibleId: z.string().uuid('ID de tipo de combustible inválido'),
  tipoTransmisionId: z.string().uuid('ID de tipo de transmisión inválido'),
});

export const UpdateVehiculoSchema = CreateVehiculoSchema.partial().extend({
  status:    z.enum(['DISPONIBLE', 'RESERVADO', 'EN_USO', 'MANTENIMIENTO', 'INACTIVO']).optional(),
  isActive:  z.boolean().optional(),
  imagenUrl: z.string().url('URL de imagen inválida').nullable().optional(),
});

export type CreateVehiculoDto = z.infer<typeof CreateVehiculoSchema>;
export type UpdateVehiculoDto  = z.infer<typeof UpdateVehiculoSchema>;
