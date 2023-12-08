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
  header: string = 'Registro de semanas con folio 123456 del cliente Juan';

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
        numeroSemana: 2,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 3,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 4,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 5,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 6,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 7,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 8,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 9,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 10,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 11,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 12,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 13,
        status: 'Pendiente',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 14,
        status: 'Pendiente',
      },
    ];
  }

  getStatusClass(statusDePago: string): string {
    return statusDePago === 'Pagado' ? 'text-green-500' : 'text-red-500';
  }
}
