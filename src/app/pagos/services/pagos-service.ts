import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { shareReplay } from 'rxjs';
import { PrestamoConDetallesCompletos } from '../interfaces/prestamos.interface';
import { SPAltaPago } from '../interfaces/SPAltaPago.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  http = inject(HttpClient);
  private readonly API_URL = environment.API_URL;
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
