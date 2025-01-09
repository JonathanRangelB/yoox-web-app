import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestListOptions, Requests } from '../types/requests';
import { User } from 'src/app/shared/interfaces/userData.interface';

@Injectable({ providedIn: 'root' })
export class RequestListService {
  private http = inject(HttpClient);
  private baseUrl = environment.API_URL;
  private token = localStorage.getItem('token');
  private user: User = JSON.parse(localStorage.getItem('user')!);

  getRequestsList(options: RequestListOptions) {
    return this.http.post<Requests[]>(
      `${this.baseUrl}loan-request/list`,
      {
        id_usuario: this.user.ID,
        rol_usuario: this.user.ROL,
        ...options,
      },
      {
        headers: {
          authorization: `${this.token}`,
        },
      }
    );
  }
}
