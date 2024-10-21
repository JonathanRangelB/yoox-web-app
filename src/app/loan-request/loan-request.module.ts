import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

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
    InputMaskModule,
    DropdownModule,
    InputTextareaModule,
    CalendarModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LoanRequestModule {}
