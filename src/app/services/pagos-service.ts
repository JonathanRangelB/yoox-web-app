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

  getPaymentsById(folio: string) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('idusuario');
    return this.http
      .get<PrestamoConDetallesCompletos>(
        `https://pcii32quc8.execute-api.us-east-2.amazonaws.com/v1/loan/${folio}`,
        {
          headers: {
            authorization: `${token}`,
            idusuario: `${userId}`,
          },
        }
      )
      .pipe(shareReplay());
  }

  pay(sPAltaPago: SPAltaPago) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('idusuario');
    return this.http
      .post(
        `https://pcii32quc8.execute-api.us-east-2.amazonaws.com/v1/loan/${sPAltaPago.ID_PRESTAMO}`,
        sPAltaPago,
        {
          headers: {
            authorization: `${token}`,
            idusuario: `${userId}`,
          },
        }
      )
      .pipe(shareReplay());
  }
}
