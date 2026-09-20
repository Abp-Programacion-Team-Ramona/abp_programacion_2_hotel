export interface User {
  id?: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
  roleId?: number;
}