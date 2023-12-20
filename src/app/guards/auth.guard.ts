import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/AuthService';

export const authGuardGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  let redirectToLogin = true;

  if (token) {
    await authService.tokenValidation(token).subscribe({
      next: (response) => {
        redirectToLogin = !response.isValid;
      },
      error: (err) => {
        router.navigate(['/login']);
        console.log(err);
      },
    });
  } else if (redirectToLogin) {
    router.navigate(['/login']);
  }
  return redirectToLogin;
};
