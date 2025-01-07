import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Requests } from '../types/requests';

@Injectable({ providedIn: 'root' })
export class RequestList {
  private http = inject(HttpClient);
  private baseUrl = environment.API_URL;
  private token = localStorage.getItem('token');

  getRequestsList() {
    return this.http.post<Requests[]>(
      `${this.baseUrl}loan-request/list`,
      {
        id_usuario: 154,
        rol_usuario: 'Cobrador',
        offSetRows: 10,
        fetchRowsNumber: 10,
      },
      {
        headers: {
          authorization: `${this.token}`,
        },
      }
    );
  }
}
