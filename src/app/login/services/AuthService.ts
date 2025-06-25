import { Injectable, inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  catchError,
  EMPTY,
  filter,
  Subscription,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import {
  TokenUserData,
  LoginResponse,
  RefreshTokenResponse,
} from '../../shared/interfaces/userData.interface';
import { TokenValidationResponse } from '../interfaces/tokenValidationResponse';
import { environment } from 'src/environments/environment';
import { UserCredentials } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly baseUrl = environment.API_URL;
  private tokenUserData?: TokenUserData;
  private tokenValidationSubscription: Subscription | null = null;
  /**
   * timeSpan: Tiempo en milisegundos que usa la web para validar si es momento de refrescar el token, se ejecuta de manera indefinida, donde x (min * seg * ms).
   */
  private readonly timeSpan = 15 * 60 * 1000; // 15 minutos
  /**
   *  timeFrameToValidate: si el tiempo actual menos el tiempo de expiracion del token es menor o igual a este tokenValidationResponse
   *  esto indica que el token ya esta a punto de vencer o ya esta vencido, entonces se solicita al backend uno nuevo.
   *  Si el token ya esta vencido, entonces el backend responde con un error indicandolo.
   */
  private readonly timeFrameToValidate = 30 * 60 * 1000; // 30 minutes en milisegundos

  constructor() {
    this.startTokenValidation();
  }

  login({ userId, password }: UserCredentials) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}login`, { userId, password })
      .pipe(
        tap((response) => {
          this.tokenUserData = JSON.parse(
            atob(response.token.split('.')[1])
          ) as TokenUserData;
          this.startTokenValidation();
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
    this.tokenUserData = undefined;
    localStorage.clear();
    this.stopTokenValidation();
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.tokenUserData;
  }

  getTokenFromLocalStorage() {
    return localStorage.getItem('token');
  }

  getUserDataFromToken(token: string) {
    const tokenPayload = token.split(' ')[1];
    const tokenUserData = JSON.parse(
      atob(tokenPayload.split('.')[1])
    ) as TokenUserData;
    return tokenUserData;
  }

  startTokenValidation() {
    // Si ya existe una suscripción activa, desuscribirse primero
    if (this.tokenValidationSubscription) {
      this.tokenValidationSubscription.unsubscribe();
      console.log('No hay suscripción de validacion, desuscribiendo');
    }

    const isTokenValid = (): boolean => {
      const token = this.getTokenFromLocalStorage();
      if (!token) {
        console.log('token no encontrado en LocalStorage');
        return false;
      }

      const tokenUserData = this.getUserDataFromToken(token);

      const now = Date.now();
      const expirationTime = tokenUserData.exp * 1000;
      const timeRemaining = expirationTime - now;
      console.table({
        now,
        expirationTime,
        timeRemaining,
        timeFrameToValidate: this.timeFrameToValidate,
      });

      // Solo validar si el token expira en 15 minutos o menos
      const result =
        timeRemaining > 0 && timeRemaining <= this.timeFrameToValidate;
      console.log(
        `Resultado de validacion de token: ${result}. Itentando nuevamente en ${this.timeSpan / 1000 / 60} minutos`
      );
      return result;
    };

    this.tokenValidationSubscription = timer(0, this.timeSpan)
      .pipe(
        filter(isTokenValid),
        switchMap(() => {
          const token = this.getTokenFromLocalStorage();
          return this.http.post<RefreshTokenResponse>(
            `${this.baseUrl}tokenRefresh`,
            {
              token,
            }
          );
        }),
        catchError((error) => {
          console.error('Error validating token:', error);
          // Redirigir a login cuando falla la validación
          this.router.navigate(['/login']);
          // Desuscribirse automáticamente después del error
          if (this.tokenValidationSubscription) {
            this.tokenValidationSubscription.unsubscribe();
            this.tokenValidationSubscription = null;
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: (data) => {
          console.log('Token refreshed successfully');
          localStorage.setItem('token', data.token);
        },
      });
  }

  // Método para detener manualmente la validación
  stopTokenValidation() {
    console.log('Deteniendo la validación del token');
    if (this.tokenValidationSubscription) {
      console.log('limpiando la suscripción de validación de token');
      this.tokenValidationSubscription.unsubscribe();
      this.tokenValidationSubscription = null;
    }
  }

  // En ngOnDestroy (si es un componente) o al destruir el servicio
  ngOnDestroy() {
    console.log('AuthService destroyed, stopping token validation');
    this.stopTokenValidation();
  }
}
