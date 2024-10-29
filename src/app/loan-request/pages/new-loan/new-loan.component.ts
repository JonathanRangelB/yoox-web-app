/* eslint-disable no-useless-escape */
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { InputNumberInputEvent } from 'primeng/inputnumber';
import {
  days,
  estadosDeLaRepublica,
  plazos,
  tiposCalle,
} from '../../utils/consts';
import {
  asyncValidator,
  curpValidator,
  emailValidator,
  lengthValidator,
} from '../../utils/customValidators';

interface dropDownCollection {
  name: string;
  value: string;
}

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css'],
})
export class NewLoanComponent {
  fb = inject(FormBuilder);
  cs = inject(ConfirmationService);
  ms = inject(MessageService);
  position: string = 'bottom';
  mainForm: FormGroup;
  tiposCalle: dropDownCollection[] = tiposCalle;
  estadosDeLaRepublica: dropDownCollection[] = estadosDeLaRepublica;
  plazos: dropDownCollection[] = plazos;
  semanasDePlazo: number | undefined;
  fechaInicial: Date | undefined;
  fechaFinal: string | null = null;
  fechaMinima: Date = new Date();
  diaDeLaSemana: string | null = null;
  days: string[] = days;
  cantidadIngresada: number = 0;
  tasaDeInteres: number = 0;
  totalAPagar: number = 0;
  pagoSemanal: number | null = null;

  constructor() {
    this.mainForm = this.fb.group({
      cantidad: [
        '',
        [Validators.required, Validators.min(1000)],
        asyncValidator(),
      ],
      plazos: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      apellidoPaternoCliente: ['', Validators.required],
      apellidoMaternoCliente: ['', Validators.required],
      telefonoFijoCliente: ['', [Validators.required]],
      telefonoMovilCliente: ['', [Validators.required]],
      correoCliente: ['', [Validators.required, emailValidator()]],
      curpCliente: ['', [Validators.required, curpValidator()]],
      tipoCalleCliente: [null, Validators.required],
      nombreCalleCliente: ['', Validators.required],
      numeroExteriorCliente: [null, Validators.required],
      coloniaCliente: ['', Validators.required],
      municipioCliente: ['', Validators.required],
      estadoCliente: ['', Validators.required],
      codigoPostalCliente: [null, [Validators.required, lengthValidator(5)]],
    });
  }

  onPlazoChanged({ value }: DropdownChangeEvent) {
    if (!value) return;
    this.semanasDePlazo = value.name;
    this.tasaDeInteres = value.value;
    this.calculaPrestamo();
    this.calculaFechaFinal();
  }

  onInputCantidad({ value }: InputNumberInputEvent) {
    if (!value) return;
    this.cantidadIngresada = +value;
    if (this.cantidadIngresada < 1000) return;
    this.calculaPrestamo();
  }

  calculaPrestamo() {
    if (!this.cantidadIngresada || !this.tasaDeInteres) return;
    this.totalAPagar = +(
      this.cantidadIngresada *
      (1 + this.tasaDeInteres / 100)
    ).toFixed(2);
    this.pagoSemanal = this.totalAPagar / this.semanasDePlazo!;
  }

  calculaDiaDeLaSemana(date: Date) {
    this.fechaInicial = date;
    const dayIndex = this.fechaInicial.getDay();
    this.diaDeLaSemana = this.days[dayIndex];
    this.calculaFechaFinal();
  }

  calculaFechaFinal() {
    if (!this.fechaInicial || !this.semanasDePlazo) return;
    const result = new Date(this.fechaInicial);
    result.setDate(result.getDate() + this.semanasDePlazo! * 7);
    this.fechaFinal = result.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  esCampoOculto(nombreDelCampo: string) {
    return (
      this.mainForm.controls[nombreDelCampo].valid ||
      (!this.mainForm.controls[nombreDelCampo].dirty &&
        !this.mainForm.controls[nombreDelCampo].touched)
    );
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.ms.add({
        severity: 'error',
        summary: 'Rechazado',
        detail:
          'Algún dato es incorrecto o aun no se ha proporcionado, revisa nuevamente los campos en el formulario.',
        life: 5000,
      });
      this.mainForm.markAllAsTouched();
      return;
    }
    this.cs.confirm({
      message:
        'Valida que la información de este formulario es correcta y verídica. Estas seguro que deseas continuar con la solicitud?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Enviar solicitud',
      acceptIcon: 'none',
      rejectLabel: 'Regresar',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.ms.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Solicitud enviada',
          life: 3000,
        });
      },
      reject: () => {
        this.ms.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'No se envió la solicitud',
          life: 3000,
        });
      },
      key: 'positionDialog',
    });
  }
}
