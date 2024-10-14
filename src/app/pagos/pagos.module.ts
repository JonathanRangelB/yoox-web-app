import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputNumberModule } from 'primeng/inputnumber';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';

import { PagosComponent } from './pages/pagos/pagos.component';
import { PagosRoutingModule } from './pagos-routing.module';

@NgModule({
  declarations: [PagosComponent],
  imports: [
    CommonModule,
    PagosRoutingModule,
    InputNumberModule,
    DataViewModule,
    TagModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
    FieldsetModule,
  ],
  exports: [PagosComponent],
  providers: [ConfirmationService, MessageService],
})
export class PagosModule {}
