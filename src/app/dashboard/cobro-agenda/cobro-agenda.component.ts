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
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

interface CobroAgenda {
  id: string;
  clienteNombre: string;
  clienteCurp: string;
  montoPrestamo: number;
  montoPago: number;
  fechaPago: Date;
  fechaVencimiento: Date;
  estatusPago: 'pendiente' | 'pagado' | 'vencido' | 'parcial';
  metodoPago: string;
  referencia: string;
  telefono: string;
  email: string;
  direccion: string;
  saldoPendiente: number;
  numeroPago: number;
  totalPagos: number;
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
    MultiSelectModule,
    FormsModule,
  ],
  templateUrl: './cobro-agenda.component.html',
  styleUrls: ['./cobro-agenda.component.css'],
})
export class CobroAgendaComponent implements OnInit {
  selectedRecord: CobroAgenda | null = null;
  cobrosAgenda: CobroAgenda[] = [];
  filteredCobros: CobroAgenda[] = [];
  loading: boolean = false;
  statusSeleccionado = [];

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
      this.cobrosAgenda = [
        {
          id: '1',
          clienteNombre: 'Juan Pérez López',
          clienteCurp: 'PELJ800101HDFXXX01',
          montoPrestamo: 50000,
          montoPago: 5000,
          fechaPago: new Date('2025-11-26'),
          fechaVencimiento: new Date('2025-11-26'),
          estatusPago: 'pendiente',
          metodoPago: 'transferencia',
          referencia: 'REF001',
          telefono: '5512345678',
          email: 'juan.perez@email.com',
          direccion: 'Calle Principal #123, Ciudad de México',
          saldoPendiente: 45000,
          numeroPago: 1,
          totalPagos: 10,
        },
        {
          id: '2',
          clienteNombre: 'María García Rodríguez',
          clienteCurp: 'GARM750315MDFXXX02',
          montoPrestamo: 30000,
          montoPago: 3000,
          fechaPago: new Date('2025-11-25'),
          fechaVencimiento: new Date('2025-11-25'),
          estatusPago: 'pagado',
          metodoPago: 'efectivo',
          referencia: 'REF002',
          telefono: '5587654321',
          email: 'maria.garcia@email.com',
          direccion: 'Avenida Secundaria #456, Guadalajara',
          saldoPendiente: 27000,
          numeroPago: 1,
          totalPagos: 10,
        },
        {
          id: '3',
          clienteNombre: 'Carlos Hernández Martínez',
          clienteCurp: 'HEMC900101NLGXXX03',
          montoPrestamo: 75000,
          montoPago: 7500,
          fechaPago: new Date('2025-11-24'),
          fechaVencimiento: new Date('2025-11-23'),
          estatusPago: 'vencido',
          metodoPago: 'tarjeta',
          referencia: 'REF003',
          telefono: '5598765432',
          email: 'carlos.hernandez@email.com',
          direccion: 'Boulevard Tercero #789, Monterrey',
          saldoPendiente: 67500,
          numeroPago: 1,
          totalPagos: 10,
        },
        {
          id: '4',
          clienteNombre: 'Ana López Torres',
          clienteCurp: 'LOTA850515DFLXXX04',
          montoPrestamo: 40000,
          montoPago: 2000,
          fechaPago: new Date('2025-11-26'),
          fechaVencimiento: new Date('2025-11-26'),
          estatusPago: 'parcial',
          metodoPago: 'deposito',
          referencia: 'REF004',
          telefono: '5511223344',
          email: 'ana.lopez@email.com',
          direccion: 'Calle Cuarta #321, Puebla',
          saldoPendiente: 38000,
          numeroPago: 2,
          totalPagos: 10,
        },
        {
          id: '5',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
        {
          id: '6',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
        {
          id: '7',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
        {
          id: '8',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
        {
          id: '9',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
        {
          id: '10',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
        {
          id: '11',
          clienteNombre: 'Roberto Sánchez Díaz',
          clienteCurp: 'SADR720101HDFXXX05',
          montoPrestamo: 60000,
          montoPago: 6000,
          fechaPago: new Date('2025-11-27'),
          fechaVencimiento: new Date('2025-11-27'),
          estatusPago: 'pendiente',
          metodoPago: 'efectivo',
          referencia: 'REF005',
          telefono: '5533445566',
          email: 'roberto.sanchez@email.com',
          direccion: 'Calle Quinta #654, Toluca',
          saldoPendiente: 54000,
          numeroPago: 3,
          totalPagos: 10,
        },
      ];

      this.filteredCobros = [...this.cobrosAgenda];
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
    return this.cobrosAgenda.filter((c) => c.estatusPago === estatus).length;
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

  onRowSelect(event: any) {
    alert('seleccionado');
  }
}
