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

  getInstallments() {
    const token = localStorage.getItem('token');
    return this.#http.get<Plazo[]>(`${this.#baseUrl}installments`, {
      headers: { authorization: `${token}` },
    });
  }
}
