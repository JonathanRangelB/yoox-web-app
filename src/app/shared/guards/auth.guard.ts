/*eslint no-unused-vars: "error"*/
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../login/services/AuthService';
import { catchError, map, of } from 'rxjs';

export const authGuardGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token') || '';

  return inject(AuthService)
    .tokenValidation(token)
    .pipe(
      map((response) => of(response.isValid)),
      catchError(({ error }) => {
        console.warn(`GuardError: ${error.error}`);
        router.navigate(['/login']);
        return of(false);
      })
    );
};
