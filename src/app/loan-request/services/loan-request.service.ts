import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanRequestService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;

  registerNewLoan(payload: any) {
    const token = localStorage.getItem('token');
    return this.http
      .post(`${this.baseUrl}loan-request/new`, payload, {
        headers: { authorization: `${token}` },
      })
      .pipe(
        map((response: any) => {
          if (response.error) {
            throw new HttpErrorResponse(response.error);
          }
          if (response.errorType) throw new Error(response.errorType);
          return response;
        })
      );
  }

  viewLoan(payload: any) {
    const token = localStorage.getItem('token');
    return this.http
      .post(`${this.baseUrl}loan-request/view`, payload, {
        headers: { authorization: `${token}` },
      })
      .pipe(
        map((response: any) => {
          if (response.error) {
            throw new HttpErrorResponse(response.error);
          }
          if (response.errorType) throw new Error(response.errorType);
          return response;
        })
      );
  }
}
