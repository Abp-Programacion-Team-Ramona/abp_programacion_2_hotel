import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from './my-reservations.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private http = inject(HttpClient);

  getAll(userId?: string): Observable<Reservation[]> {
    let params = new HttpParams();
    if (userId) params = params.set('id_usuario', userId);
    return this.http.get<Reservation[]>(`${API_URL}/reservations`, { params });
  }
}