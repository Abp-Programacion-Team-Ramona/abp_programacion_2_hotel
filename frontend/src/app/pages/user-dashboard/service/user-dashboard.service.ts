import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../model/user-dashboard.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);

  getById(id: string): Observable<User> {
    return this.http.get<User>(
      `${environment.apiUrl}/usuarios/${encodeURIComponent(id)}/`
    );
  }
}