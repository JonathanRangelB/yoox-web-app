import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {
  CommonModule,
  NgOptimizedImage,
  registerLocaleData,
} from '@angular/common';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LandingComponent } from './components/landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { PanelModule } from 'primeng/panel';
import { ReactiveFormsModule } from '@angular/forms';
import localeEsMX from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMX);

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    NotFoundComponent,
    LandingComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgOptimizedImage,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    PanelModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
