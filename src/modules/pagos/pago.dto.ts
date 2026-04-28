import { z } from 'zod';

export const CreatePagoSchema = z.object({
  reservaId:  z.string().uuid('El ID de reserva debe ser un UUID válido'),
  monto:      z.number({
                required_error:    'El monto es requerido',
                invalid_type_error: 'El monto debe ser un número',
              })
              .positive('El monto debe ser mayor a 0')
              .max(999_999.99, 'El monto no puede superar $999,999.99'),
  metodoPago: z.enum(
    ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'PAYPAL', 'OTRO'],
    { errorMap: () => ({ message: 'Método de pago inválido' }) },
  ),
  referencia: z.string().trim().max(100, 'La referencia no puede superar 100 caracteres').optional(),
});

export type CreatePagoDto = z.infer<typeof CreatePagoSchema>;
