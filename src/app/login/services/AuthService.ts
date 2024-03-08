import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { UserData } from '../../shared/interfaces/userData.interface';
import { TokenValidationResponse } from '../interfaces/tokenValidationResponse';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  login({ userId, password }: User) {
    return this.http
      .post<UserData>(`${this.API_URL}login`, { userId, password })
      .pipe(shareReplay());
  }

  tokenValidation(token: string) {
    return this.http
      .get<TokenValidationResponse>(`${this.API_URL}tokenValidation`, {
        headers: { authorization: token },
      })
      .pipe(shareReplay());
  }
}
