import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ExistingCurpValidationService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;

  validate(body: any) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    return this.#http.post(`${this.#baseUrl}validate/curp`, body, {
      headers: { authorization: `${token}` },
    });
  }
}
