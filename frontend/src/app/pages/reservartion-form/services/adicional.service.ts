import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Adicional } from '../models/adicional.model';

@Injectable({
    providedIn: 'root'
})
export class AdicionalService {

    private apiUrl = 'http://127.0.0.1:8000/api/v1/adicionales/';

    constructor(private http: HttpClient) { }

    getAdicionales(): Observable<Adicional[]> {
        return this.http.get<Adicional[]>(this.apiUrl);
    }
}