import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenUserData } from 'src/app/shared/interfaces/userData.interface';
import { AgendaDeCobro, Options } from '../interfaces/cobro-agenda.interface';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;

  getOutstandingCollectionsReport(options: Options) {
    const user: TokenUserData = JSON.parse(localStorage.getItem('user')!);
    const token = localStorage.getItem('token');
    return this.#http.post<AgendaDeCobro>(
      `${this.#baseUrl}get-outstanding-collections-report`,
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
