import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  user: any
  constructor(private authService: AuthService) {
    this.requestLogin()
  }

  requestLogin() {
    this.authService.login("SUPERVISOR", "1").subscribe((usr: any) => {
      this.user = usr
      localStorage.setItem('token', usr.Autorization)
    })
  }
}
