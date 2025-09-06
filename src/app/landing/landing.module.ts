import { NgModule } from '@angular/core';
import { LandingComponent } from './pages/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CarouselModule } from 'primeng/carousel';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
  declarations: [LandingComponent, TermsComponent, PrivacyComponent],
  imports: [ButtonModule, LandingRoutingModule, ToolbarModule, CarouselModule],
})
export class LandingModule {}
