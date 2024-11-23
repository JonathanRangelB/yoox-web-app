import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';
import {
  SearchCustomerData,
  Customer,
} from '../types/searchCustomers.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchCustomersService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;

  searchCustomers(payload: SearchCustomerData) {
    const token = localStorage.getItem('token');
    return this.http
      .post<SearchCustomerData>(`${this.baseUrl}get-customer`, payload, {
        headers: { authorization: `${token}` },
      })
      .pipe(
        map((response: any) => {
          if (response.error) {
            throw new HttpErrorResponse(response.error);
          }
          if (response.errorType) throw new Error(response.errorType);
          return response as Customer[];
        })
      );
  }
}
