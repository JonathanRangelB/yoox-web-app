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
  error: string = ""

  constructor(private authService: AuthService) { }

  requestLogin() {
    // stores auth token on local storage
    // const token = localStorage.getItem('token')
    // if (token) {
    //   console.warn(token)
    // }

    // clean up the messages of previous calls
    this.error = ""
    this.userData = undefined

    this.authService.login(this.user, this.password.toUpperCase()).subscribe((usr: any) => {
      this.userData = usr
      localStorage.setItem('token', usr.Autorization)
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 404) {
          this.error = error.error?.message
          console.log(this.error);
        }
        else {
          this.error = "Ocurrio un error, intenta nuevamente"
          console.log(this.error);
        }
      }
    })

  }
}
