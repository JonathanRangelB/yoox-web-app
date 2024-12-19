import { HttpClient } from '@angular/common/http';
import { Plazo } from '../types/loan-request.interface';
import { environment } from 'src/environments/environment';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InstallmentsService {
  readonly #baseUrl = environment.API_URL;
  readonly #http = inject(HttpClient);
  readonly #token = localStorage.getItem('token');

  getInstallments() {
    return this.#http.get<Plazo[]>(`${this.#baseUrl}installments`, {
      headers: { authorization: `${this.#token}` },
    });
  }
}
