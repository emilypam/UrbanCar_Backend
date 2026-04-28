export type AlquilerStatus = 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

export class Alquiler {
  constructor(
    public readonly id: string,
    public readonly reservaId: string,
    public readonly kmSalida: number,
    public kmEntrada: number | null,
    public readonly fechaInicio: Date,
    public fechaFin: Date | null,
    public status: AlquilerStatus,
  ) {}

  calcularKmRecorridos(): number {
    if (!this.kmEntrada) return 0;
    return this.kmEntrada - this.kmSalida;
  }
}
