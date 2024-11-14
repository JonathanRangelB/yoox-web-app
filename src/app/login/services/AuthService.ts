import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { User, UserData } from '../../shared/interfaces/userData.interface';
import { TokenValidationResponse } from '../interfaces/tokenValidationResponse';
import { environment } from 'src/environments/environment';
import { UserCredentials } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;
  private user?: User;

  login({ userId, password }: UserCredentials) {
    return this.http
      .post<UserData>(`${this.baseUrl}login`, { userId, password })
      .pipe(
        tap((response) => {
          console.log({ response });
          this.user = response.user;
        })
      );
  }

  tokenValidation(token: string) {
    const headers = new HttpHeaders().set('authorization', token);
    return this.http.get<TokenValidationResponse>(
      `${this.baseUrl}tokenValidation`,
      {
        headers,
      }
    );
  }

  logout(): void {
    this.user = undefined;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.user;
  }
}
