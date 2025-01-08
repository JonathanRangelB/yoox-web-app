import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Requests } from '../types/requests';
import { User } from 'src/app/shared/interfaces/userData.interface';

@Injectable({ providedIn: 'root' })
export class RequestList {
  private http = inject(HttpClient);
  private baseUrl = environment.API_URL;
  private token = localStorage.getItem('token');
  private user: User = JSON.parse(localStorage.getItem('user')!);

  getRequestsList(
    offSetRows: number,
    fetchRowsNumber: number,
    status?: string,
    nombreCliente?: string,
    folio?: string
  ) {
    return this.http.post<Requests[]>(
      `${this.baseUrl}loan-request/list`,
      {
        id_usuario: this.user.ID,
        rol_usuario: this.user.ROL,
        offSetRows,
        fetchRowsNumber,
        status,
        nombreCliente,
        folio,
      },
      {
        headers: {
          authorization: `${this.token}`,
        },
      }
    );
  }
}
