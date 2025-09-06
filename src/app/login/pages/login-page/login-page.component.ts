import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/shared/interfaces/userData.interface';
import { AuthService } from 'src/app/login/services/AuthService';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PanelModule,
    InputTextModule,
  ],
})
export class LoginPageComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  isProdEnv = environment.PRODUCTION;
  environmentName = environment.ENV_NAME;
  loginForm!: FormGroup;
  loginResponse?: LoginResponse;
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
    this.loginResponse = undefined;
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

  handleSuccessfullLogin = (token: LoginResponse) => {
    const user = this.authService.currentUser;
    this.loading = false;
    localStorage.setItem('token', token.token);
    localStorage.setItem('idusuario', user!.ID.toString());
    localStorage.setItem('nombreusuario', user!.NOMBRE);
    localStorage.setItem('user', JSON.stringify(user));

    this.router.navigate(['/dashboard']);
  };

  handleError = (error: Error) => {
    this.loading = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status == 404) {
        this.error = error.error;
      } else {
        this.error = this.errorMessage;
      }
    }
  };

  goToLanding() {
    this.router.navigate(['/']);
  }
}
