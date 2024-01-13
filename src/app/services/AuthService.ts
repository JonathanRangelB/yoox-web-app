import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { User } from '../models/user';
import { UserData } from '../models/userData';
import { TokenValidationResponse } from '../models/tokenValidationResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = process.env['API_URL'] || 'http://localhost:3000/';

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
