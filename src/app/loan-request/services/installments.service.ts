import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Plazo } from '../types/loan-request.interface';

@Injectable({
  providedIn: 'root',
})
export class InstallmentsService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;
  readonly #token = localStorage.getItem('token');

  getInstallments() {
    return this.#http.get<Plazo[]>(`${this.#baseUrl}installments`, {
      headers: { authorization: `${this.#token}` },
    });
  }
}
