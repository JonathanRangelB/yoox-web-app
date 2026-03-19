import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  RequestList,
  RequestListOptions,
  RequestListState,
  State,
} from '../types/requests';
import { TokenUserData } from 'src/app/shared/interfaces/userData.interface';

@Injectable({ providedIn: 'root' })
export class RequestListService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;
  private state: State = {
    filters: {} as any,
    data: {
      loanRequests: [],
      usersList: [],
      groups: [],
      management: [],
      unfilteredRequests: [],
      totalRecords: 0,
    },
  };

  getRequestsList(options: RequestListOptions) {
    const user: TokenUserData = JSON.parse(localStorage.getItem('user')!);
    const token = localStorage.getItem('token');
    return this.#http.post<RequestList>(
      `${this.#baseUrl}loan-request/list`,
      {
        id_usuario: user.ID,
        rol_usuario: user.ROL,
        ...options,
      },
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
  }

  save(payload: { filters: any; data: RequestListState }) {
    this.state = { filters: payload.filters, data: payload.data };
  }

  recover() {
    return this.state;
  }

  clean() {
    this.state = {
      filters: {},
      data: {
        loanRequests: [],
        usersList: [],
        groups: [],
        management: [],
        unfilteredRequests: [],
        totalRecords: 0,
      },
    };
  }
}
