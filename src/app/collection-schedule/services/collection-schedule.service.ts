import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  CollectionsPlanner,
  CollectionsPlannerPatchRequest,
  CollectionsPlannerPostRequest,
} from '../interfaces/collection-schedule.interface';

@Injectable({ providedIn: 'root' })
export class CollectionScheduleService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;

  getCollectionSchedule(payload: CollectionsPlannerPostRequest) {
    const token = localStorage.getItem('token');

    return this.#http.post<CollectionsPlanner[]>(
      `${this.#baseUrl}collection-schedule`,
      payload,
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
  }

  updateRecord(payload: CollectionsPlannerPatchRequest) {
    const token = localStorage.getItem('token');

    return this.#http.patch<CollectionsPlanner>(
      `${this.#baseUrl}collection-schedule`,
      payload,
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
  }
}
