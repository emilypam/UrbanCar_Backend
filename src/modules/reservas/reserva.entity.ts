export type ReservaStatus = 'PENDIENTE' | 'CONFIRMADA' | 'ACTIVA' | 'COMPLETADA' | 'CANCELADA';

export class Reserva {
  constructor(
    public readonly id: string,
    public readonly codigoReserva: string,
    public readonly usuarioId: string,
    public readonly vehiculoId: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly diasTotal: number,
    public readonly totalAmount: number,
    public status: ReservaStatus,
    public readonly createdAt: Date,
  ) {}

  isCancellable(): boolean {
    return this.status === 'PENDIENTE' || this.status === 'CONFIRMADA';
  }
}
