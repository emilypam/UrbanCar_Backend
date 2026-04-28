import { z } from 'zod';
import { zNombreOrg, zTelefonoOpcional } from '../../shared/utils/validation.utils.js';

export const CreateAgenciaSchema = z.object({
  nombre:    zNombreOrg('El nombre de la agencia', 3, 150),
  empresaId: z.string().uuid('ID de empresa inválido'),
  ciudadId:  z.string().uuid('ID de ciudad inválido'),
  telefono:  zTelefonoOpcional,
  email:     z.string().trim().email('Formato de email inválido').optional()
               .or(z.literal('').transform(() => undefined)),
  direccion: z.string().trim().max(300, 'La dirección no puede superar 300 caracteres').optional(),
  isActive:  z.boolean().default(true),
});

export const UpdateAgenciaSchema = CreateAgenciaSchema.partial();

export type CreateAgenciaDto = z.infer<typeof CreateAgenciaSchema>;
export type UpdateAgenciaDto  = z.infer<typeof UpdateAgenciaSchema>;
