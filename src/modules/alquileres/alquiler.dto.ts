import { z } from 'zod';

export const CreateAlquilerSchema = z.object({
  reservaId: z.string().uuid('El ID de reserva debe ser un UUID válido'),
  kmSalida:  z.number({
               required_error:    'El kilometraje de salida es requerido',
               invalid_type_error: 'El kilometraje debe ser un número entero',
             })
             .int('El kilometraje de salida debe ser un número entero (sin decimales)')
             .min(0,         'El kilometraje de salida no puede ser negativo')
             .max(2_000_000, 'El kilometraje de salida supera el límite permitido'),
  observaciones: z.string().trim().max(500, 'Las observaciones no pueden superar 500 caracteres').optional(),
});

export type CreateAlquilerDto = z.infer<typeof CreateAlquilerSchema>;
