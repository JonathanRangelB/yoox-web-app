import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/userData';
import { AuthService } from 'src/app/services/AuthService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  isProdEnv = environment.production;
  environmentName = environment.ENV_NAME;
  loginForm!: FormGroup;
  userData: UserData | undefined;
  error = '';
  loading = false;
  errorMessage = 'Ocurrio un error al intentar ingresar, intente mas tarde';

  submitted = false;

  ngOnInit() {
    this.loginForm = new FormGroup({
      user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    console.log({
      isProdEnv: this.isProdEnv,
      environmentName: this.environmentName,
    });
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  requestLogin() {
    // clean up the messages of previous calls
    this.error = '';
    this.userData = undefined;
    this.loading = true;

    this.authService
      .login({
        userId: this.loginForm.value.user,
        password: this.loginForm.value.password.toUpperCase(),
      })
      .subscribe({
        next: this.handleSuccessfullLogin,
        error: this.handleError,
      });
  }

  handleSuccessfullLogin = (usr: UserData) => {
    this.userData = usr;
    this.loading = false;
    localStorage.setItem('token', usr.Autorization);
    console.log(usr);
    // TODO: hacer un servicio para poder guardar los datos de usuario en el y evitar el uso de localStorage
    localStorage.setItem('idusuario', usr.user.ID.toString());

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
