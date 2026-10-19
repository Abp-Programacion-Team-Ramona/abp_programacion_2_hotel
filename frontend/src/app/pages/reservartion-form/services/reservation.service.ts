import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    private apiUrl = 'http://127.0.0.1:8000/api/v1/reservas/';

    constructor(private http: HttpClient) { }

    createReservation(reservation: Reservation): Observable<Reservation> {
        return this.http.post<Reservation>(this.apiUrl, reservation);
    }
}