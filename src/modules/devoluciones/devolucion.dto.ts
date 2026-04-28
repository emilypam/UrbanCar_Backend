import { z } from 'zod';

export const CreateDevolucionSchema = z.object({
  alquilerId:     z.string().uuid('El ID de alquiler debe ser un UUID válido'),
  kmEntrada:      z.number({
                    required_error:    'El kilometraje de entrada es requerido',
                    invalid_type_error: 'El kilometraje debe ser un número entero',
                  })
                  .int('El kilometraje de entrada debe ser un número entero (sin decimales)')
                  .min(0,         'El kilometraje de entrada no puede ser negativo')
                  .max(2_000_000, 'El kilometraje de entrada supera el límite permitido'),
  estadoVehiculo: z.enum(
    ['EXCELENTE', 'BUENO', 'REGULAR', 'DAÑADO'],
    { errorMap: () => ({ message: 'Estado del vehículo inválido' }) },
  ),
  cargoExtra:     z.number({ invalid_type_error: 'El cargo extra debe ser un número' })
                   .min(0,      'El cargo extra no puede ser negativo')
                   .max(50_000, 'El cargo extra supera el límite permitido')
                   .default(0),
  observaciones:  z.string().trim().max(500, 'Las observaciones no pueden superar 500 caracteres').optional(),
});

export type CreateDevolucionDto = z.infer<typeof CreateDevolucionSchema>;
