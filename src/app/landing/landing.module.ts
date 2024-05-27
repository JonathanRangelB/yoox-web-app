import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './pages/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, ButtonModule],
})
export class LandingModule {}
