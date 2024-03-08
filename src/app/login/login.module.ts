import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { LoginRoutingModule } from './login.routing.module';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    HttpClientModule,
    ButtonModule,
    LoginRoutingModule,
    RouterModule,
    InputTextModule,
  ],
})
export class LoginModule {}
