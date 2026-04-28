import { z } from 'zod';
import { zNumeroLicencia, zFechaFutura } from '../../shared/utils/validation.utils.js';

export const CreateClienteSchema = z.object({
  usuarioId:         z.string().min(1, 'El ID de usuario es requerido'),
  numeroLicencia:    zNumeroLicencia,
  fechaVencLicencia: zFechaFutura('La fecha de vencimiento de licencia'),
});

export const UpdateClienteSchema = z.object({
  numeroLicencia:    zNumeroLicencia.optional(),
  fechaVencLicencia: zFechaFutura('La fecha de vencimiento de licencia').optional(),
});

export type CreateClienteDto = z.infer<typeof CreateClienteSchema>;
export type UpdateClienteDto = z.infer<typeof UpdateClienteSchema>;
