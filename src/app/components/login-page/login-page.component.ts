import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  userData: any
  user: string = ""
  password: string = ""

  constructor(private authService: AuthService) { }

  requestLogin() {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   console.warn(token)
    // }

    this.authService.login(this.user, this.password.toUpperCase()).subscribe((usr: any) => {
      this.userData = usr
      localStorage.setItem('token', usr.Autorization)
    }, error => {
      if (error instanceof HttpErrorResponse)
        this.userData = { "message": error.error?.message, "statusCode": error.status }
    })

  }
}
