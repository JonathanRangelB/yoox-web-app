import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { shareReplay } from 'rxjs';
import { PrestamoConDetallesCompletos } from '../models/db/prestamos';
import { SPAltaPago } from '../models/storedProcedures/SPAltaPago';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  http = inject(HttpClient);
  private readonly API_URL = process.env['API_URL'] || 'http://localhost:3000/';
  getPaymentsById(folio: string) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('idusuario');
    return this.http
      .get<PrestamoConDetallesCompletos>(`${this.API_URL}loan/${folio}`, {
        headers: {
          authorization: `${token}`,
          idusuario: `${userId}`,
        },
      })
      .pipe(shareReplay());
  }

  pay(sPAltaPago: SPAltaPago) {
    const token = localStorage.getItem('token');

    return this.http
      .post(
        `${this.API_URL}payment`,
        { spaAltaPago: sPAltaPago },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      )
      .pipe(shareReplay());
  }
}
