import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Address } from '../types/loan-request.interface';

@Injectable({ providedIn: 'root' })
export class AddressService {
  readonly #baseUrl = environment.API_URL;
  readonly #http = inject(HttpClient);

  getAddress(addressid: number) {
    const params = new HttpParams().set('addressid', addressid);
    const token = localStorage.getItem('token');

    return this.#http.get<Address>(`${this.#baseUrl}address`, {
      headers: { authorization: `${token}` },
      params,
    });
  }
}
