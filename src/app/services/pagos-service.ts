import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PrestamosDetalle } from '../models/db/prestamos_detalle';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  http = inject(HttpClient);

  getPaymentsById(folio: string) {
    // get the authorization token from the local storage and set it in the get request header using httpClient
    const token = localStorage.getItem('token');
    return this.http
      .get<PrestamosDetalle[]>(
        `https://pcii32quc8.execute-api.us-east-2.amazonaws.com/v1/payments/${folio}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .pipe(shareReplay());
  }
}
