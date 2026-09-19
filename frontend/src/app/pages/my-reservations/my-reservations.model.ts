export interface Reservation {
  id: string;             
  id_usuario: string;
  id_habitacion: string;
  desde: string;          
  hasta: string;
  huespedes: number;
  observaciones: string;
  estado: string;        
  adicionales: string[];
}