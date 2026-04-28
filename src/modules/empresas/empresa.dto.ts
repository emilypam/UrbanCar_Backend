import { z } from 'zod';
import { zNombreOrg, zRucOpcional, zTelefonoOpcional } from '../../shared/utils/validation.utils.js';

export const CreateEmpresaSchema = z.object({
  nombre:    zNombreOrg('El nombre de la empresa', 3, 150),
  ruc:       zRucOpcional,
  email:     z.string().trim().email('Formato de email inválido').optional()
               .or(z.literal('').transform(() => undefined)),
  telefono:  zTelefonoOpcional,
  direccion: z.string().trim().max(300, 'La dirección no puede superar 300 caracteres').optional(),
  isActive:  z.boolean().default(true),
});

export const UpdateEmpresaSchema = CreateEmpresaSchema.partial();

export type CreateEmpresaDto = z.infer<typeof CreateEmpresaSchema>;
export type UpdateEmpresaDto  = z.infer<typeof UpdateEmpresaSchema>;
