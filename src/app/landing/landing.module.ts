import { NgModule } from '@angular/core';
import { LandingComponent } from './pages/landing.component';
import { LandingRoutingModule } from './landing-routing.module';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [LandingComponent],
  imports: [ButtonModule, LandingRoutingModule, ToolbarModule, CarouselModule],
})
export class LandingModule {}
