export class Cliente {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly licenciaConducir: string,
    public readonly fechaVencimientoLicencia: Date,
    public readonly telefono: string | null,
    public readonly direccion: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
