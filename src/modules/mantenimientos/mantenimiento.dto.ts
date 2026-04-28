import { z } from 'zod';
import { zSoloLetras } from '../../shared/utils/validation.utils.js';

const fechaStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido');

// Schema base sin superRefine para poder llamar .partial() y .omit()
const MantenimientoBase = z.object({
  vehiculoId:  z.string().uuid('El ID de vehículo debe ser un UUID válido'),
  tipo:        z.string().trim()
                .min(3,   'El tipo debe tener al menos 3 caracteres')
                .max(100, 'El tipo no puede superar 100 caracteres'),
  descripcion: z.string().trim()
                .min(5,   'La descripción debe tener al menos 5 caracteres')
                .max(500, 'La descripción no puede superar 500 caracteres'),
  fechaInicio: fechaStr,
  fechaFin:    fechaStr.optional(),
  costo:       z.number({ invalid_type_error: 'El costo debe ser un número' })
                .min(0,       'El costo no puede ser negativo')
                .max(999_999, 'El costo supera el límite permitido')
                .optional(),
  tecnico:     zSoloLetras('El nombre del técnico', 2, 100).optional(),
});

// CreateSchema agrega la validación de rango de fechas
export const CreateMantenimientoSchema = MantenimientoBase.superRefine((data, ctx) => {
  if (data.fechaInicio && data.fechaFin) {
    if (new Date(data.fechaFin + 'T00:00:00') < new Date(data.fechaInicio + 'T00:00:00')) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['fechaFin'],
        message: 'La fecha de fin no puede ser anterior a la fecha de inicio',
      });
    }
  }
});

// UpdateSchema se construye desde la base (ZodObject) antes del superRefine
export const UpdateMantenimientoSchema = MantenimientoBase
  .partial()
  .omit({ vehiculoId: true })
  .extend({ isActive: z.boolean().optional() });

export type CreateMantenimientoDto = z.infer<typeof CreateMantenimientoSchema>;
export type UpdateMantenimientoDto = z.infer<typeof UpdateMantenimientoSchema>;
