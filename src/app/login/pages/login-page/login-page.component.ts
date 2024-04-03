import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/shared/interfaces/userData.interface';
import { AuthService } from 'src/app/login/services/AuthService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  isProdEnv = environment.production;
  environmentName = environment.ENV_NAME;
  loginForm!: FormGroup;
  userData?: UserData;
  error = '';
  loading = false;
  errorMessage = 'Ocurrio un error al intentar ingresar, intente mas tarde';

  submitted = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  requestLogin() {
    // clean up the messages of previous calls
    this.error = '';
    this.userData = undefined;
    this.loading = true;

    this.authService
      .login({
        userId: this.loginForm?.controls['user'].value.toUpperCase(),
        password: this.loginForm?.get('password')?.value,
      })
      .subscribe({
        next: this.handleSuccessfullLogin,
        error: this.handleError,
      });
  }

  handleSuccessfullLogin = (user: UserData) => {
    this.userData = user;
    this.loading = false;
    localStorage.setItem('token', user.Autorization);
    localStorage.setItem('idusuario', user.user.ID.toString());

    this.router.navigate(['/pagos']);
  };

  handleError = (error: Error) => {
    this.loading = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status == 404) {
        this.error = error.error?.message;
      } else {
        this.error = this.errorMessage;
      }
    }
  };
}
