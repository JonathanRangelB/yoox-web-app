import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { BusquedaClientesComponent } from './components/busqueda-clientes/busqueda-clientes.component';
import { ListS3FilesComponent } from './components/list-s3-files/list-s3-files.component';
import { LoanComponent } from './pages/loan/new-loan.component';
import { LoanRequestRoutingModule } from './loan-request-routing.module';
import { RefinanceSearchComponent } from './components/refinance-search/refinance-search.component';

@NgModule({
  declarations: [LoanComponent],
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
    ConfirmDialogModule,
    ToastModule,
    FileUploadModule,
    InputSwitchModule,
    KeyFilterModule,
    TooltipModule,
    TableModule,
    BusquedaClientesComponent,
    DialogModule,
    ProgressSpinnerModule,
    ListS3FilesComponent,
    CardModule,
    RefinanceSearchComponent,
  ],
  providers: [ConfirmationService, MessageService],
})
export class LoanRequestModule { }
