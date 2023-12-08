import { Component, OnInit } from '@angular/core';

interface Pago {
  folio: string;
  monto: number;
  fecha: string;
  nombreCliente: string;
  numeroSemana: number;
  status: 'Pagado' | 'Pendiente';
}

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent implements OnInit {
  pagosPendientesDelFolio: Pago[] = [];
  ngOnInit(): void {
    this.pagosPendientesDelFolio = [
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 1,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 1,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 1,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 1,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 1,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 1,
        status: 'Pendiente',
      },
    ];
  }

  getStatusClass(statusDePago: string): string {
    return statusDePago === 'Pagado' ? 'text-green-500' : 'text-red-500';
  }
}
