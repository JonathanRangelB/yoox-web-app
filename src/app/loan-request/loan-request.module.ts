import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { LoanRequestRoutingModule } from './loan-request-routing.module';
import { NewLoanComponent } from './pages/new-loan/new-loan.component';
import { UpdateLoanComponent } from './pages/update-loan/update-loan.component';
import { ViewLoanComponent } from './pages/view-loan/view-loan.component';

@NgModule({
  declarations: [NewLoanComponent, UpdateLoanComponent, ViewLoanComponent],
  imports: [
    CommonModule,
    LoanRequestRoutingModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
  ],
})
export class LoanRequestModule {}
