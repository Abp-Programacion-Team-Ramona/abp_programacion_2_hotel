export interface User {
  id?: string;
  nombre: string;
  apellido: string;
  num_contacto: string;
  email: string;
  password?: string;
  id_rol?: string; 
}