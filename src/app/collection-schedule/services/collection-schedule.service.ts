import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenUserData } from 'src/app/shared/interfaces/userData.interface';
import {
  CollectionsPlanner,
  CollectionsPlannerPatchRequest,
  CollectionsPlannerPostRequest,
} from '../interfaces/collection-schedule.interface';

@Injectable({ providedIn: 'root' })
export class CollectionScheduleService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = environment.API_URL;

  getCollectionSchedule() {
    const token = localStorage.getItem('token');
    const user: TokenUserData = JSON.parse(localStorage.getItem('user')!);
    const payload: CollectionsPlannerPostRequest = {
      id_user: user.ID,
    };

    return this.#http.post<CollectionsPlanner[]>(
      `${this.#baseUrl}collections-planner`,
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
      `${this.#baseUrl}collections-planner`,
      payload,
      {
        headers: {
          authorization: `${token}`,
        },
      }
    );
  }
}
