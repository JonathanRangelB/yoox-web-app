import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { curpValidator } from '../../utils/customValidators';
import { SearchCustomersService } from '../../services/search-customers.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Customer } from '../../types/searchCustomers.interface';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-busqueda-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './busqueda-clientes.component.html',
  styles: `
    table tr td {
      display: inline-block;
      width: 100px; /* adjust to desired width */
    }
  `,
})
export class BusquedaClientesComponent {
  fb = inject(FormBuilder);
  searchCustomerService = inject(SearchCustomersService);
  ms = inject(MessageService);
  clientesEncontrados: Customer[] = [];
  customerSearchForm: FormGroup;
  loading = false;

  constructor() {
    this.customerSearchForm = this.fb.group({
      id: [null],
      curp: [null, curpValidator()],
      nombre: [null],
    });
  }

  llenaCampos(event: TableRowSelectEvent) {
    console.log(event.data);
  }

  customerSearch() {
    this.loading = true;
    const formData = this.generatePayload();
    if (Object.keys(formData).length === 0) {
      this.loading = false;
      this.ms.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se proporciono ningun dato de busqueda',
      });
      return;
    }
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      this.loading = false;
      this.ms.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrio un error al obtener el usuario',
      });
      return;
    }
    const id_agente = JSON.parse(currentUser!).ID;
    const payload = { ...formData, id_agente };
    this.searchCustomerService.searchCustomers(payload).subscribe({
      next: (result: any) => {
        this.loading = false;
        this.clientesEncontrados = result?.registrosEncontrados;
      },
      error: ({ error }) => {
        this.loading = false;
        this.ms.add({
          severity: 'error',
          summary: error.message,
          detail: error.error,
        });
      },
    });
  }

  generatePayload() {
    return Object.fromEntries(
      Object.entries(this.customerSearchForm.value).filter(
        ([, value]) => value !== null && value !== undefined && value !== ''
      )
    );
  }
}
