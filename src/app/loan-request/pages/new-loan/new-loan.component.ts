import { Component, OnInit } from '@angular/core';
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
  tiposCalle: dropDownCollection[] | undefined;
  estadosDeLaRepublica: dropDownCollection[] | undefined;
  plazos: dropDownCollection[] | undefined;
  semanasDePlazo: string | undefined;
  calleSeleccionada: dropDownCollection | undefined;
  estadosDeLaRepublicaSeleccionado: dropDownCollection | undefined;
  fechaInicial: Date | undefined;
  fechaFinal: string | undefined;
  diaDeLaSemana: string | null = null;
  days: string[] = [];
  cantidadIngresada: number = 0;
  tasaDeInteres: number = 0;
  totalAPagar: number = 0;

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
      { name: '14', value: '40' },
      { name: '28', value: '82' },
      { name: '12', value: '20' },
      { name: '13', value: '30' },
      { name: '11', value: '10' },
      { name: '35', value: '110' },
      { name: '26', value: '80' },
      { name: '24', value: '56' },
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
  }

  onPlazoChanged({ value }: DropdownChangeEvent) {
    if (!value) return;
    this.semanasDePlazo = value.name;
    this.tasaDeInteres = +value.value;
    this.calculaPrestamo();
    if (this.fechaInicial && this.semanasDePlazo) this.calculaFechaFinal();
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
    console.table({
      tazaDeInteres: this.tasaDeInteres,
      cantidadIngresada: this.cantidadIngresada,
      total: this.totalAPagar,
    });
  }

  calculaDiaDeLaSemana() {
    if (!this.fechaInicial) return;
    const dayIndex = this.fechaInicial.getDay();
    this.diaDeLaSemana = this.days[dayIndex];
    if (this.fechaInicial && this.semanasDePlazo) this.calculaFechaFinal();
  }

  calculaFechaFinal() {
    const result = new Date(this.fechaInicial!);
    result.setDate(result.getDate() + +this.semanasDePlazo! * 7);
    this.fechaFinal = result.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
