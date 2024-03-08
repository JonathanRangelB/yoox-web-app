import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, isDevMode } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  CommonModule,
  NgOptimizedImage,
  registerLocaleData,
} from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { LandingComponent } from './landing/landing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localeEsMX from '@angular/common/locales/es-MX';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginModule } from './login/login.module';

registerLocaleData(localeEsMX);

@NgModule({
  declarations: [AppComponent, NotFoundComponent, LandingComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    LoginModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-MX' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
