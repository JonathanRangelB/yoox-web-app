import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagosComponent } from './pages/pagos/pagos.component';
import { PagosRoutingModule } from './pagos-routing.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './pages/layout/layout.component';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({
  declarations: [PagosComponent, LayoutComponent],
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
    MenubarModule,
    SidebarModule,
    PanelMenuModule,
  ],
  exports: [PagosComponent],
  providers: [ConfirmationService, MessageService],
})
export class PagosModule {}
