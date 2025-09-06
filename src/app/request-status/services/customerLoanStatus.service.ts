import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomerLoanStatus } from '../types/customerLoanStatus.type';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerLoanStatusService {
  readonly #baseUrl = environment.API_URL;
  readonly #http = inject(HttpClient);

  getCustomerLoanStatus(loanid: string, apellido_paterno_cliente: string) {
    const params = new HttpParams()
      .set('loanid', loanid)
      .set('apellido', apellido_paterno_cliente);
    return this.#http.get<CustomerLoanStatus>(
      `${this.#baseUrl}customer-loan-status`,
      { params }
    );
  }
}
