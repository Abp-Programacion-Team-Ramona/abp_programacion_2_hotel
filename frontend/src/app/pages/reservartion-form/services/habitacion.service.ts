import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Habitacion } from '../models/habitacion.model';

@Injectable({
    providedIn: 'root'
})
export class HabitacionService {

    private apiUrl = 'http://127.0.0.1:8000/api/v1/habitaciones/';

    constructor(private http: HttpClient) { }

    getHabitaciones(): Observable<Habitacion[]> {
        return this.http.get<Habitacion[]>(this.apiUrl);
    }
}