import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosComponent } from './pages/pagos/pagos.component';
import { MenuModule } from 'primeng/menu';
import { PagosRoutingModule } from './pagos-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { OrderListModule } from 'primeng/orderlist';

@NgModule({
  declarations: [PagosComponent],
  imports: [
    CommonModule,
    MenuModule,
    PagosRoutingModule,
    InputTextModule,
    InputNumberModule,
    OrderListModule,
  ],
  exports: [PagosComponent],
})
export class PagosModule {}
