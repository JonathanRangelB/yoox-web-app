import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { InputNumberInputEvent } from 'primeng/inputnumber';

interface dropDownCollection {
  name: string;
  value: string;
}

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css'],
})
export class NewLoanComponent implements OnInit {
  fb = inject(FormBuilder);
  cs = inject(ConfirmationService);
  ms = inject(MessageService);
  position: string = 'bottom';
  mainForm: FormGroup;
  tiposCalle: dropDownCollection[] | undefined;
  estadosDeLaRepublica: dropDownCollection[] | undefined;
  plazos: dropDownCollection[] | undefined;
  semanasDePlazo: number | undefined;
  calleSeleccionada: dropDownCollection | undefined;
  estadosDeLaRepublicaSeleccionado: dropDownCollection | undefined;
  fechaInicial: Date | undefined;
  fechaFinal: string | null = null;
  fechaMinima: Date | undefined;
  diaDeLaSemana: string | null = null;
  days: string[] = [];
  cantidadIngresada: number = 0;
  tasaDeInteres: number = 0;
  totalAPagar: number = 0;
  pagoSemanal: number | null = null;

  constructor() {
    this.mainForm = this.fb.group({
      cantidad: [null, [Validators.required, Validators.min(1000)]],
      plazos: [null, Validators.required],
      fechaInicial: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.tiposCalle = [
      { name: 'CARRETERA', value: 'CARRETERA' },
      { name: 'PRIVADA', value: 'PRIVADA' },
      { name: 'CALLE', value: 'CALLE' },
      { name: 'BOULEVARD', value: 'BOULEVARD' },
      { name: 'PROLONGACION', value: 'PROLONGACION' },
      { name: 'AVENIDA', value: 'AVENIDA' },
    ];

    this.estadosDeLaRepublica = [
      { name: 'Aguascalientes', value: 'aguascalientes' },
      { name: 'Baja California', value: 'baja-california' },
      { name: 'Baja California Sur', value: 'baja-california-sur' },
      { name: 'Campeche', value: 'campeche' },
      { name: 'Chiapas', value: 'chiapas' },
      { name: 'Chihuahua', value: 'chihuahua' },
      { name: 'CDMX', value: 'ciudad-de-mexico' },
      { name: 'Coahuila', value: 'coahuila' },
      { name: 'Colima', value: 'colima' },
      { name: 'Durango', value: 'durango' },
      { name: 'Guanajuato', value: 'guanajuato' },
      { name: 'Guerrero', value: 'guerrero' },
      { name: 'Hidalgo', value: 'hidalgo' },
      { name: 'Jalisco', value: 'jalisco' },
      { name: 'Estado de México', value: 'estado-de-mexico' },
      { name: 'Michoacán', value: 'michoacan' },
      { name: 'Morelos', value: 'morelos' },
      { name: 'Nayarit', value: 'nayarit' },
      { name: 'Nuevo León', value: 'nuevo-leon' },
      { name: 'Oaxaca', value: 'oaxaca' },
      { name: 'Puebla', value: 'puebla' },
      { name: 'Querétaro', value: 'queretaro' },
      { name: 'Quintana Roo', value: 'quintana-roo' },
      { name: 'San Luis Potosí', value: 'san-luis-potosi' },
      { name: 'Sinaloa', value: 'sinaloa' },
      { name: 'Sonora', value: 'sonora' },
      { name: 'Tabasco', value: 'tabasco' },
      { name: 'Tamaulipas', value: 'tamaulipas' },
      { name: 'Tlaxcala', value: 'tlaxcala' },
      { name: 'Veracruz', value: 'veracruz' },
      { name: 'Yucatán', value: 'yucatan' },
      { name: 'Zacatecas', value: 'zacatecas' },
    ];

    this.plazos = [
      { name: '11', value: '10' },
      { name: '12', value: '20' },
      { name: '13', value: '30' },
      { name: '14', value: '40' },
      { name: '24', value: '56' },
      { name: '26', value: '80' },
      { name: '28', value: '82' },
      { name: '35', value: '110' },
    ];

    this.days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    this.fechaMinima = new Date();
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

  onSubmit() {
    if (!this.mainForm.valid) {
      this.ms.add({
        severity: 'error',
        summary: 'Rechazado',
        detail:
          'Algún dato en el formulario es incorrecto o aun no se ha proporcionado, revisa nuevamente los campos.',
        life: 3000,
      });
      this.mainForm.markAllAsTouched();
      return;
    }
    this.cs.confirm({
      message: 'Estas seguro que deseas continunar con la solicitud?',
      header: 'Confirmacion',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.ms.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Solicitud enviada',
        });
      },
      reject: () => {
        this.ms.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: 'Proceso cancelado',
          life: 3000,
        });
      },
      key: 'positionDialog',
    });
  }
}
