import { Component } from '@angular/core';
import { UserData } from 'src/app/models/userData';
import { AuthService } from '../../services/AuthService';
import { HttpErrorResponse } from '@angular/common/http';

const errorMessage = 'Ocurrio un error al intentar ingresar, intente mas tarde';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  userData: UserData | undefined;
  user = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService) {}

  requestLogin() {
    // clean up the messages of previous calls
    this.error = '';
    this.userData = undefined;
    this.loading = true;

    this.authService
      .login({ userId: this.user, password: this.password.toUpperCase() })
      .subscribe({
        next: this.handleSuccessfullLogin,
        error: this.handleError,
      });
  }

  handleSuccessfullLogin = (usr: UserData) => {
    this.userData = usr;
    this.loading = false;
    localStorage.setItem('token', usr.Autorization);
  };

  handleError = (error: Error) => {
    this.loading = false;
    if (error instanceof HttpErrorResponse) {
      if (error.status == 404) {
        this.error = error.error?.message;
        console.log(this.error);
      } else {
        this.error = errorMessage;
        console.log(this.error);
      }
    }
  };
}
