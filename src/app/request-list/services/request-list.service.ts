import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestList, RequestListOptions } from '../types/requests';
import { User } from 'src/app/shared/interfaces/userData.interface';

@Injectable({ providedIn: 'root' })
export class RequestListService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;

  getRequestsList(options: RequestListOptions) {
    const user: User = JSON.parse(localStorage.getItem('user')!);
    const token = localStorage.getItem('token');
    return this.#http.post<RequestList>(
      `${this.#baseUrl}loan-request/list`,
      {
        id_usuario: user.ID,
        rol_usuario: user.ROL,
        ...options,
      },
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
  }
}
