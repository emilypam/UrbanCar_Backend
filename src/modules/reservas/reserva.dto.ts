import { z } from 'zod';

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)');

export const CreateReservaSchema = z.object({
  vehiculoId:   z.string().min(1, 'El vehículo es requerido'),
  agenciaId:    z.string().min(1, 'La agencia es requerida'),
  fechaInicio:  dateString.refine(v => {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    return new Date(v + 'T00:00:00') >= hoy;
  }, 'La fecha de inicio no puede ser anterior a hoy'),
  fechaFin:     dateString,
  seguroId:     z.string().min(1).optional(),
  canalVentaId: z.string().min(1).optional(),
  extras:       z.array(z.object({
    extraId:  z.string().min(1, 'El ID del extra es requerido'),
    cantidad: z.number()
               .int('La cantidad de extras debe ser un número entero')
               .min(1, 'La cantidad mínima de extras es 1')
               .max(10, 'La cantidad máxima de extras es 10'),
  })).optional(),
  notas: z.string().trim().max(500, 'Las notas no pueden superar 500 caracteres').optional(),
}).superRefine((data, ctx) => {
  if (data.fechaInicio && data.fechaFin) {
    const inicio = new Date(data.fechaInicio + 'T00:00:00');
    const fin    = new Date(data.fechaFin    + 'T00:00:00');
    if (fin <= inicio) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['fechaFin'],
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
      });
    }
  }
});

export const UpdateReservaStatusSchema = z.object({
  status: z.enum(
    ['PENDIENTE', 'CONFIRMADA', 'ACTIVA', 'COMPLETADA', 'CANCELADA'],
    { errorMap: () => ({ message: 'Estado de reserva inválido' }) },
  ),
});

export type CreateReservaDto       = z.infer<typeof CreateReservaSchema>;
export type UpdateReservaStatusDto = z.infer<typeof UpdateReservaStatusSchema>;
