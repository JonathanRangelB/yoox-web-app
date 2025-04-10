import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

import { curpValidator } from '../../utils/customValidators';
import { SearchCustomersService } from '../../services/search-customers.service';
import { Customer } from '../../types/searchCustomers.interface';
import { estadosDeLaRepublica, tiposCalle } from '../../utils/consts';
import { IdsRecuperados } from '../../types/loan-request.interface';

@Component({
  selector: 'app-busqueda-clientes',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  styleUrls: ['./busqueda-clientes.component.css'],
})
export class BusquedaClientesComponent {
  readonly parentForm = input.required<FormGroup>();
  readonly visible = output<void>();
  readonly idsRecuperados = output<IdsRecuperados>();
  readonly #formBuilder = inject(FormBuilder);
  readonly #searchCustomerService = inject(SearchCustomersService);
  readonly #messageService = inject(MessageService);
  clientesEncontrados = signal<Customer[]>([]);
  loading = signal(false);
  customerSearchForm = this.#formBuilder.group({
    id: [null],
    curp: [null, curpValidator()],
    nombre: [null],
  });

  llenaCampos(event: TableRowSelectEvent) {
    const {
      id_cliente,
      id_aval,
      nombre_cliente,
      telefono_fijo_cliente,
      telefono_movil_cliente,
      correo_electronico_cliente,
      ocupacion_cliente,
      curp_cliente,
      tipo_calle_cliente,
      nombre_calle_cliente,
      numero_exterior_cliente,
      numero_interior_cliente,
      colonia_cliente,
      municipio_cliente,
      estado_cliente,
      cp_cliente,
      id_domicilio_cliente,
      nombre_aval,
      telefono_fijo_aval,
      telefono_movil_aval,
      correo_electronico_aval,
      curp_aval,
      tipo_calle_aval,
      nombre_calle_aval,
      numero_exterior_aval,
      numero_interior_aval,
      colonia_aval,
      municipio_aval,
      estado_aval,
      cp_aval,
      id_domicilio_aval,
    } = event.data as Customer;

    this.idsRecuperados.emit({
      id_aval,
      id_cliente,
      id_domicilio_cliente,
      id_domicilio_aval,
    });

    this.parentForm()
      .get('formCliente.nombre_cliente')
      ?.setValue(nombre_cliente);
    this.parentForm()
      .get('formCliente.telefono_fijo_cliente')
      ?.setValue(telefono_fijo_cliente ?? '');
    this.parentForm()
      .get('formCliente.telefono_movil_cliente')
      ?.setValue(telefono_movil_cliente ?? '');
    this.parentForm()
      .get('formCliente.correo_electronico_cliente')
      ?.setValue(correo_electronico_cliente ?? '');
    this.parentForm()
      .get('formCliente.ocupacion_cliente')
      ?.setValue(ocupacion_cliente);
    this.parentForm().get('formCliente.curp_cliente')?.setValue(curp_cliente);
    this.parentForm()
      .get('formCliente.tipo_calle_cliente')
      ?.setValue(tiposCalle.find((data) => data.value === tipo_calle_cliente));
    this.parentForm()
      .get('formCliente.nombre_calle_cliente')
      ?.setValue(nombre_calle_cliente);
    this.parentForm()
      .get('formCliente.numero_exterior_cliente')
      ?.setValue(numero_exterior_cliente);
    this.parentForm()
      .get('formCliente.numero_interior_cliente')
      ?.setValue(numero_interior_cliente);
    this.parentForm()
      .get('formCliente.colonia_cliente')
      ?.setValue(colonia_cliente);
    this.parentForm()
      .get('formCliente.municipio_cliente')
      ?.setValue(municipio_cliente);
    this.parentForm()
      .get('formCliente.estado_cliente')
      ?.setValue(
        estadosDeLaRepublica.find((data) => data.value === estado_cliente)
      );
    this.parentForm().get('formCliente.cp_cliente')?.setValue(cp_cliente);

    // Comienzan los campos de aval
    this.parentForm().get('formAval.nombre_aval')?.setValue(nombre_aval);
    this.parentForm()
      .get('formAval.telefono_fijo_aval')
      ?.setValue(telefono_fijo_aval ?? '');
    this.parentForm()
      .get('formAval.telefono_movil_aval')
      ?.setValue(telefono_movil_aval ?? '');
    this.parentForm()
      .get('formAval.correo_electronico_aval')
      ?.setValue(correo_electronico_aval ?? '');
    this.parentForm().get('formAval.curp_aval')?.setValue(curp_aval);
    this.parentForm()
      .get('formAval.tipo_calle_aval')
      ?.setValue(tiposCalle.find((data) => data.value === tipo_calle_aval));
    this.parentForm()
      .get('formAval.nombre_calle_aval')
      ?.setValue(nombre_calle_aval);
    this.parentForm()
      .get('formAval.numero_exterior_aval')
      ?.setValue(numero_exterior_aval);
    this.parentForm()
      .get('formAval.numero_interior_aval')
      ?.setValue(numero_interior_aval ?? '');
    this.parentForm().get('formAval.colonia_aval')?.setValue(colonia_aval);
    this.parentForm().get('formAval.municipio_aval')?.setValue(municipio_aval);
    this.parentForm()
      .get('formAval.estado_aval')
      ?.setValue(
        estadosDeLaRepublica.find((data) => data.value === estado_aval)
      );
    this.parentForm().get('formAval.cp_aval')?.setValue(cp_aval);
    this.#hideSelfComponent();
  }

  /** Le indica al componente padre que la visibilidad de esta componente cambio */
  #hideSelfComponent() {
    // this.customerFoundId.emit(this.idsRecuperados);
    this.visible.emit();
  }

  /** Metodo principal encargado de buscar los registros de clientes */
  customerSearch(event: SubmitEvent | MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.loading.set(true);
    const formData = this.#generatePayload();
    if (Object.keys(formData).length === 0) {
      this.loading.set(false);
      this.#messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se proporciono ningun dato de busqueda',
      });
      return;
    }
    const currentUser = localStorage.getItem('user');
    if (!currentUser) {
      this.loading.set(false);
      this.#messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrio un error al obtener el usuario',
      });
      return;
    }
    const id_agente = JSON.parse(currentUser!).ID;
    const payload = { ...formData, id_agente };
    this.#searchCustomerService.searchCustomers(payload).subscribe({
      next: (foundCustomers: Customer[]) => {
        this.loading.set(false);
        this.clientesEncontrados.set(foundCustomers);
      },
      error: ({ error, errorMessage, errorType }) => {
        this.loading.set(false);
        this.#messageService.add({
          severity: 'error',
          summary: error?.message || errorMessage,
          detail: error?.error || errorType,
        });
      },
    });
  }

  /**
   * @returns  Objeto que incluye todos los elementos del objeto de busqueda de clientes para que no esten vacios o sean invalidos
   */
  #generatePayload() {
    return Object.fromEntries(
      Object.entries(this.customerSearchForm.value).filter(
        ([, value]) => value !== null && value !== undefined && value !== ''
      )
    );
  }
}
