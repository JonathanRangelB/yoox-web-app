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

import { ClientesEncontrados } from '../../types/loan-request.interface';
import { curpValidator } from '../../utils/customValidators';

@Component({
  selector: 'app-busqueda-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
  ],
  templateUrl: './busqueda-clientes.component.html',
})
export class BusquedaClientesComponent {
  fb = inject(FormBuilder);
  clientesEncontrados: ClientesEncontrados[] = [];
  customerSearchForm: FormGroup;

  constructor() {
    this.customerSearchForm = this.fb.group({
      id: [''],
      curp: ['', curpValidator()],
      nombre: [''],
    });
  }

  llenaCampos(event: TableRowSelectEvent) {
    console.log(event.data);
  }

  customerSearch() {
    // TODO: placeholder de datos de clientesEncontrados
    this.clientesEncontrados = [
      {
        id: 1,
        curp: 'RABJ881221HJCNRN09',
        nombre: 'Jonathan Rangel Bernal',
        ocupacion: 'developer',
        correo_electronico: 'jona@gmail.dev',
      },
      {
        id: 2,
        curp: 'RABJ881221HJCNRN09',
        nombre: 'Jonathan Rangel Bernal',
        ocupacion: 'chofer',
        correo_electronico: 'jona@trabajo.com',
      },
      {
        id: 3,
        curp: 'RABJ881221HJCNRN09',
        nombre: 'Jonathan Rangel Bernal',
        ocupacion: 'mesero',
        correo_electronico: 'jona@outlook.com',
      },
    ];
  }
}
