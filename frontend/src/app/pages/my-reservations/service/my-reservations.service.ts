import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reservation } from '../model/my-reservations.model';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private http = inject(HttpClient);

  getAll(userId?: string): Observable<Reservation[]> {
    let params = new HttpParams();
    if (userId) params = params.set('id_usuario', userId);
    return this.http.get<Reservation[]>(`${environment.apiUrl}/reservas/`, { params });
  }
}