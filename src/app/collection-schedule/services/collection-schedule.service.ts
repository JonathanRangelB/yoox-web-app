import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CollectionSchedulePayload,
  CollectionScheduleResponse,
  ScheduleAgenda,
} from '../interfaces/collection-schedule.interface';
import { MOCK_SCHEDULE_DATA } from '../data/mock-table-data';
import {
  MOCK_AGENTS_LIST,
  MOCK_GROUPS_LIST,
  MOCK_MANAGEMENT_LIST,
} from '../data/mock-filter-data';

@Injectable({ providedIn: 'root' })
export class CollectionScheduleService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;
  //TODO: Eliminar mock data cuando el endpoint real esté disponible
  #mockData = [...MOCK_SCHEDULE_DATA];

  getCollectionSchedule() {
    const token = localStorage.getItem('token');
    return this.#http
      .get<CollectionScheduleResponse>(
        `${this.#baseUrl}v1/collection-schedule`,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      )
      .pipe(
        //TODO: Eliminar fallback de mock data cuando el endpoint real esté disponible
        catchError(() =>
          of<CollectionScheduleResponse>({
            data: this.#mockData,
            management: MOCK_MANAGEMENT_LIST,
            groups: MOCK_GROUPS_LIST,
            agents: MOCK_AGENTS_LIST,
          }).pipe(delay(500))
        )
      );
  }

  updateRecord(payload: CollectionSchedulePayload) {
    const token = localStorage.getItem('token');
    return this.#http
      .patch<ScheduleAgenda>(
        `${this.#baseUrl}v1/collection-schedule`,
        payload,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      )
      .pipe(
        //TODO: Eliminar fallback de mock data cuando el endpoint real esté disponible
        catchError(() => {
          const index = this.#mockData.findIndex(
            (item) => item.loan_request_id === payload.loan_request_id
          );
          if (index === -1) {
            throw new Error('Registro no encontrado');
          }
          const updated = {
            ...this.#mockData[index],
            ...payload,
            last_change_utc_date: new Date(),
          } as ScheduleAgenda;
          this.#mockData[index] = updated;
          return of(updated).pipe(delay(500));
        })
      );
  }
}
