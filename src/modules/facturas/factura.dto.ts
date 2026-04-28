import { z } from 'zod';
import { zRucOpcional } from '../../shared/utils/validation.utils.js';

export const CreateFacturaSchema = z.object({
  reservaId:   z.string().uuid('El ID de reserva debe ser un UUID válido'),
  pagoId:      z.string().uuid('El ID de pago debe ser un UUID válido').optional(),
  rucCliente:  zRucOpcional,
  razonSocial: z.string().trim().max(200, 'La razón social no puede superar 200 caracteres').optional(),
});

export type CreateFacturaDto = z.infer<typeof CreateFacturaSchema>;
