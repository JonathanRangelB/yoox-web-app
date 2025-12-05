import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

interface registroCobranza {
  id: number;
  nombreCliente: string;
  folioDeCredito: string;
  diaDePago: string;
  plazo: number;
  montoPrestamo: number;
  montoPago: number;
  fechaUltimoPago: string | null;
  pagoActual: number;
  pagosRestante: number;
  totalPagos: number;
  saldoPendiente: number;
  numeroAtrasos: number;
  fechaVencimiento: string;
  estatusPago: string;
}

@Component({
  selector: 'app-cobro-agenda',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    InputSwitchModule,
    FormsModule,
  ],
  templateUrl: './cobro-agenda.component.html',
  styleUrls: ['./cobro-agenda.component.css'],
})
export class CobroAgendaComponent implements OnInit {
  selectedRecord: registroCobranza | null = null;
  datosAgenda: registroCobranza[] = [];
  respaldoDatosAgenda: registroCobranza[] = [];
  loading: boolean = false;

  estatusPagoOptions = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Pagado', value: 'pagado' },
    { label: 'Vencido', value: 'vencido' },
    { label: 'Parcial', value: 'parcial' },
  ];

  metodoPagoOptions = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Transferencia', value: 'transferencia' },
    { label: 'Tarjeta', value: 'tarjeta' },
    { label: 'Depósito', value: 'deposito' },
  ];

  ngOnInit(): void {
    this.loadCobrosAgenda();
  }

  loadCobrosAgenda(): void {
    this.loading = true;

    setTimeout(() => {
      this.datosAgenda = [
        {
          id: 1,
          nombreCliente: 'Jonathan Rangel Bernal Bernal Bernal',
          folioDeCredito: '00001A',
          diaDePago: 'Lunes',
          plazo: 14,
          montoPrestamo: 10000,
          montoPago: 1000,
          fechaUltimoPago: null,
          pagoActual: 5,
          pagosRestante: 9,
          totalPagos: 14,
          saldoPendiente: 9000,
          numeroAtrasos: 2,
          fechaVencimiento: '2024-11-15',
          estatusPago: 'pendiente',
        },
        {
          id: 2,
          nombreCliente: 'María Guadalupe López García',
          folioDeCredito: '00002B',
          diaDePago: 'Martes',
          plazo: 10,
          montoPrestamo: 8000,
          montoPago: 1000,
          fechaUltimoPago: '2025-12-02',
          pagoActual: 8,
          pagosRestante: 0,
          totalPagos: 8,
          saldoPendiente: 0,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-02',
          estatusPago: 'pagado',
        },
        {
          id: 3,
          nombreCliente: 'Carlos Alberto Hernández Ramírez',
          folioDeCredito: '00003A',
          diaDePago: 'Miércoles',
          plazo: 14,
          montoPrestamo: 15000,
          montoPago: 1500,
          fechaUltimoPago: '2025-11-20',
          pagoActual: 10,
          pagosRestante: 4,
          totalPagos: 14,
          saldoPendiente: 6000,
          numeroAtrasos: 1,
          fechaVencimiento: '2025-12-18',
          estatusPago: 'parcial',
        },
        {
          id: 4,
          nombreCliente: 'Ana Karen Morales Sánchez',
          folioDeCredito: '00004C',
          diaDePago: 'Jueves',
          plazo: 7,
          montoPrestamo: 5000,
          montoPago: 1000,
          fechaUltimoPago: '2025-11-15',
          pagoActual: 3,
          pagosRestante: 2,
          totalPagos: 5,
          saldoPendiente: 2000,
          numeroAtrasos: 3,
          fechaVencimiento: '2025-11-28',
          estatusPago: 'vencido',
        },
        {
          id: 5,
          nombreCliente: 'José Luis Pérez Castillo',
          folioDeCredito: '00005B',
          diaDePago: 'Viernes',
          plazo: 14,
          montoPrestamo: 12000,
          montoPago: 1200,
          fechaUltimoPago: null,
          pagoActual: 12,
          pagosRestante: 2,
          totalPagos: 14,
          saldoPendiente: 2400,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-17',
          estatusPago: 'pendiente',
        },
        {
          id: 6,
          nombreCliente: 'Laura Martínez Díaz',
          folioDeCredito: '00006A',
          diaDePago: 'Lunes',
          plazo: 10,
          montoPrestamo: 9000,
          montoPago: 1125,
          fechaUltimoPago: '2025-12-02',
          pagoActual: 8,
          pagosRestante: 0,
          totalPagos: 8,
          saldoPendiente: 0,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-02',
          estatusPago: 'pagado',
        },
        {
          id: 7,
          nombreCliente: 'Miguel Ángel Torres Vargas',
          folioDeCredito: '00007C',
          diaDePago: 'Miércoles',
          plazo: 14,
          montoPrestamo: 20000,
          montoPago: 2000,
          fechaUltimoPago: null,
          pagoActual: 6,
          pagosRestante: 8,
          totalPagos: 14,
          saldoPendiente: 16000,
          numeroAtrasos: 4,
          fechaVencimiento: '2025-11-10',
          estatusPago: 'vencido',
        },
        {
          id: 8,
          nombreCliente: 'Sofía González Rivera',
          folioDeCredito: '00008B',
          diaDePago: 'Viernes',
          plazo: 7,
          montoPrestamo: 6000,
          montoPago: 1200,
          fechaUltimoPago: '2025-12-03',
          pagoActual: 5,
          pagosRestante: 0,
          totalPagos: 5,
          saldoPendiente: 0,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-03',
          estatusPago: 'pagado',
        },
        {
          id: 9,
          nombreCliente: 'Daniel Ortega Mendoza',
          folioDeCredito: '00009A',
          diaDePago: 'Martes',
          plazo: 10,
          montoPrestamo: 11000,
          montoPago: 1375,
          fechaUltimoPago: '2025-11-28',
          pagoActual: 6,
          pagosRestante: 2,
          totalPagos: 8,
          saldoPendiente: 2750,
          numeroAtrasos: 1,
          fechaVencimiento: '2025-12-09',
          estatusPago: 'parcial',
        },
        {
          id: 10,
          nombreCliente: 'Valeria Jiménez Cruz',
          folioDeCredito: '00010C',
          diaDePago: 'Jueves',
          plazo: 14,
          montoPrestamo: 18000,
          montoPago: 1800,
          fechaUltimoPago: null,
          pagoActual: 9,
          pagosRestante: 5,
          totalPagos: 14,
          saldoPendiente: 9000,
          numeroAtrasos: 0,
          fechaVencimiento: '2026-01-05',
          estatusPago: 'pendiente',
        },
        {
          id: 11,
          nombreCliente: 'Roberto Castillo Flores',
          folioDeCredito: '00011A',
          diaDePago: 'Lunes',
          plazo: 14,
          montoPrestamo: 14000,
          montoPago: 1400,
          fechaUltimoPago: null,
          pagoActual: 4,
          pagosRestante: 10,
          totalPagos: 14,
          saldoPendiente: 14000,
          numeroAtrasos: 3,
          fechaVencimiento: '2025-11-20',
          estatusPago: 'vencido',
        },
        {
          id: 12,
          nombreCliente: 'Fernanda Ramírez Soto',
          folioDeCredito: '00012B',
          diaDePago: 'Miércoles',
          plazo: 10,
          montoPrestamo: 7500,
          montoPago: 937.5,
          fechaUltimoPago: '2025-12-04',
          pagoActual: 8,
          pagosRestante: 0,
          totalPagos: 8,
          saldoPendiente: 0,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-04',
          estatusPago: 'pagado',
        },
        {
          id: 13,
          nombreCliente: 'Eduardo Vargas Ruiz',
          folioDeCredito: '00013C',
          diaDePago: 'Viernes',
          plazo: 7,
          montoPrestamo: 4000,
          montoPago: 800,
          fechaUltimoPago: '2025-11-25',
          pagoActual: 3,
          pagosRestante: 2,
          totalPagos: 5,
          saldoPendiente: 1600,
          numeroAtrasos: 2,
          fechaVencimiento: '2025-12-05',
          estatusPago: 'vencido',
        },
        {
          id: 14,
          nombreCliente: 'Gabriela Herrera Ortiz',
          folioDeCredito: '00014A',
          diaDePago: 'Martes',
          plazo: 14,
          montoPrestamo: 16000,
          montoPago: 1600,
          fechaUltimoPago: null,
          pagoActual: 11,
          pagosRestante: 3,
          totalPagos: 14,
          saldoPendiente: 4800,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-23',
          estatusPago: 'pendiente',
        },
        {
          id: 15,
          nombreCliente: 'Luis Enrique Domínguez',
          folioDeCredito: '00015B',
          diaDePago: 'Jueves',
          plazo: 10,
          montoPrestamo: 9500,
          montoPago: 1187.5,
          fechaUltimoPago: '2025-11-30',
          pagoActual: 6,
          pagosRestante: 2,
          totalPagos: 8,
          saldoPendiente: 2375,
          numeroAtrasos: 1,
          fechaVencimiento: '2025-12-11',
          estatusPago: 'parcial',
        },
        {
          id: 36,
          nombreCliente: 'Carmen Velázquez Rojas',
          folioDeCredito: '00036A',
          diaDePago: 'Martes',
          plazo: 14,
          montoPrestamo: 13000,
          montoPago: 1300,
          fechaUltimoPago: null,
          pagoActual: 13,
          pagosRestante: 1,
          totalPagos: 14,
          saldoPendiente: 1300,
          numeroAtrasos: 0,
          fechaVencimiento: '2025-12-10',
          estatusPago: 'pendiente',
        },
        {
          id: 37,
          nombreCliente: 'Alejandro Guzmán Morales',
          folioDeCredito: '00037C',
          diaDePago: 'Jueves',
          plazo: 7,
          montoPrestamo: 7000,
          montoPago: 1400,
          fechaUltimoPago: null,
          pagoActual: 2,
          pagosRestante: 3,
          totalPagos: 5,
          saldoPendiente: 4200,
          numeroAtrasos: 4,
          fechaVencimiento: '2025-11-21',
          estatusPago: 'vencido',
        },
      ];

      this.respaldoDatosAgenda = [...this.datosAgenda];
      this.loading = false;
    }, 1000);
  }

  getEstatusSeverity(
    estatus: string
  ): 'success' | 'info' | 'danger' | 'warning' | 'secondary' | 'contrast' {
    switch (estatus) {
      case 'pagado':
        return 'success';
      case 'pendiente':
        return 'info';
      case 'vencido':
        return 'danger';
      case 'parcial':
        return 'warning';
      default:
        return 'info';
    }
  }

  getCountByEstatus(estatus: string): number {
    return this.datosAgenda.filter(
      (c) => c.estatusPago.toUpperCase() === estatus.toUpperCase()
    ).length;
  }

  getEstatusLabel(estatus: string): string {
    switch (estatus) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'vencido':
        return 'Vencido';
      case 'parcial':
        return 'Parcial';
      default:
        return estatus;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  }

  onGlobalFilter(event: Event, dt: any): void {
    const target = event.target as HTMLInputElement;
    dt.filterGlobal(target.value, 'contains');
  }

  refreshData(): void {
    this.loadCobrosAgenda();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Vencido':
        return 'danger';
      case 'Pagado':
        return 'success';
      case 'Pendiente':
        return 'info';
      case 'Parcial':
        return 'warning';
      default:
        return undefined;
    }
  }

  resetTable(table: any) {
    if (this.respaldoDatosAgenda.length <= 0) return;
    this.datosAgenda = [...this.respaldoDatosAgenda];
    table.reset();
  }
}
