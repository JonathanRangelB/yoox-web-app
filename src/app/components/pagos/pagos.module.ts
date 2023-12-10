import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosComponent } from './pages/pagos/pagos.component';
import { MenuModule } from 'primeng/menu';
import { PagosRoutingModule } from './pagos-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderListModule } from 'primeng/orderlist';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PagosComponent],
  imports: [
    CommonModule,
    MenuModule,
    PagosRoutingModule,
    InputTextModule,
    InputNumberModule,
    OrderListModule,
    DataViewModule,
    TagModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    ReactiveFormsModule,
  ],
  exports: [PagosComponent],
  providers: [ConfirmationService, MessageService],
})
export class PagosModule {}
