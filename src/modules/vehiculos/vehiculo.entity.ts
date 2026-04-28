export type VehicleStatus = 'DISPONIBLE' | 'RESERVADO' | 'EN_USO' | 'MANTENIMIENTO' | 'INACTIVO';

export class Vehiculo {
  constructor(
    public readonly id: string,
    public readonly placa: string,
    public readonly precioDia: number,
    public status: VehicleStatus,
    public readonly isActive: boolean,
    public readonly deletedAt: Date | null,
  ) {}

  isAvailable(): boolean {
    return this.status === 'DISPONIBLE' && this.isActive && !this.deletedAt;
  }

  calcularTotal(dias: number): number {
    return Number(this.precioDia) * dias;
  }
}
