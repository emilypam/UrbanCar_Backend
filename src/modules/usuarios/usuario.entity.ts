export type UserRole = 'ADMIN' | 'OPERADOR' | 'CLIENTE';

export class Usuario {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
  ) {}

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }
}
