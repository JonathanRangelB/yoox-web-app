import { Component } from '@angular/core';
import { UserData } from 'src/app/models/userData';
import { AuthService } from '../../services/AuthService';
import { HttpErrorResponse } from '@angular/common/http';

const errorMessage = 'Ocurrio un error, intenta nuevamente';
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

  constructor(private authService: AuthService) {}

  requestLogin() {
    // clean up the messages of previous calls
    this.error = '';
    this.userData = undefined;

    this.authService
      .login({ userId: this.user, password: this.password.toUpperCase() })
      .subscribe({
        next: this.handleSuccessfullLogin,
        error: this.handleError,
      });
  }

  handleSuccessfullLogin = (usr: UserData) => {
    this.userData = usr;
    localStorage.setItem('token', usr.Autorization);
    console.log(this.userData);
  };

  handleError = (error: Error) => {
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
