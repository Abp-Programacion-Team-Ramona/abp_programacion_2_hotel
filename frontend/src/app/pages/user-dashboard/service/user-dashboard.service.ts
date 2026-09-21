import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user-dashboard.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/${encodeURIComponent(id)}`);
  }
}