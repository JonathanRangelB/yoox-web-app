import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './pages/not-found';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { Button } from 'primeng/button';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFoundRoutingModule, Button],
})
export class NotFoundModule {}
