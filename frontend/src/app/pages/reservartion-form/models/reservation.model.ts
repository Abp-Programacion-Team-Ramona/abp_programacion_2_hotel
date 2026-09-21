export interface Reservation {
    id?: string;
    id_usuario: string;
    id_habitacion: string;
    observaciones: string;
    estado: string;
    adicionales: string[];
    desde: string;
    hasta: string;
    huespedes: number;
}