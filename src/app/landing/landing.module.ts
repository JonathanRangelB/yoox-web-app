import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './pages/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
  declarations: [LandingComponent, TermsComponent, PrivacyComponent],
  imports: [CommonModule, LandingRoutingModule],
})
export class LandingModule {}
