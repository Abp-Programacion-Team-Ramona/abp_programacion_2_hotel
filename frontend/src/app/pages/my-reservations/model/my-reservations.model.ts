export interface Reservation {
  id: string;             
  id_usuario: string;
  id_habitacion: string;
  numero_habitacion: number;
  desde: string;          
  hasta: string;
  huespedes: number;
  observaciones: string;
  estado: string;        
  adicionales: string[];
}