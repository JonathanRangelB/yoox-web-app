import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService';

export const authGuardGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token') || '';

  return inject(AuthService)
    .tokenValidation(token)
    .subscribe({
      next: (response) => {
        return !response.isValid;
      },
      error: (error) => {
        console.warn(`GuardError: ${error.error.error}`);
        router.navigate(['/login']);
      },
    });
};
