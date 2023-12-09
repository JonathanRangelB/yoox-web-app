import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

type Pago = {
  folio: string;
  monto: number;
  fecha: string;
  nombreCliente: string;
  numeroSemana: number;
  status: StatusDePago;
};

type StatusDePago = 'Pagado' | 'Pendiente' | 'Vencido';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent implements OnInit {
  pagosPendientesDelFolio: Pago[] = [];
  dialogIsVisible: boolean = false;
  header: string = 'Registro de semanas con folio 123456 del cliente Juan';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 5,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 6,
        status: 'Pagado',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 7,
        status: 'Vencido',
      },
      {
        folio: '123456',
        monto: 1000,
        fecha: '2021-01-01',
        nombreCliente: 'Juan',
        numeroSemana: 8,
        status: 'Vencido',
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

  getStatusClass(statusDePago: StatusDePago): string {
    if (statusDePago === 'Pagado') return 'text-green-500';
    else if (statusDePago === 'Pendiente') return 'text-yellow-500';
    else return 'text-red-500';
  }

  getSeverity(item: Pago): string {
    if (item.status === 'Pagado') return 'success';
    else if (item.status === 'Pendiente') return 'warning';
    else return 'danger';
  }

  activarBotonPago(item: Pago): boolean {
    if (item.status === 'Pagado') return true;
    else return false;
  }

  pagar(item: Pago): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de pagar la semana ${item.numeroSemana} del folio ${item.folio}?`,
      accept: () => {
        this.pagosPendientesDelFolio = this.pagosPendientesDelFolio.map(
          (pago) => {
            if (pago.numeroSemana === item.numeroSemana) {
              return {
                ...pago,
                status: 'Pagado',
              };
            } else return pago;
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Acción cancelada',
          detail: 'El pago no se ha registrado',
          icon: 'pi pi-exclamation-triangle',
        });
      },
    });
  }
}
