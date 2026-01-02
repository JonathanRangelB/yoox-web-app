import { Component, OnInit, signal } from '@angular/core';
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
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { getUserFromLocalStorage } from 'src/app/shared/utils/functions.utils';

interface registroCobranza {
  id_cliente: number;
  nombreCliente: string;
  nombreGrupo: string;
  nombreGerencia: string;
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
    SidebarModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './cobro-agenda.component.html',
  styleUrls: ['./cobro-agenda.component.css'],
})
export class CobroAgendaComponent implements OnInit {
  selectedRecord: registroCobranza | null = null;
  datosAgenda: registroCobranza[] = [];
  respaldoDatosAgenda: registroCobranza[] = [];
  loading: boolean = false;
  filterMenuOpen: boolean = false;
  users = signal<string[]>([]);
  selectedUser: string = '';
  currentUser = getUserFromLocalStorage();

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
          id_cliente: 1,
          nombreCliente: 'Jonathan Rangel Bernal Bernal Bernal',
          nombreGrupo: 'Planeacion Agustin',
          nombreGerencia: 'Gerencia Guillermo',
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
          id_cliente: 2,
          nombreCliente: 'María Guadalupe López García',
          nombreGrupo: 'Planeacion Agustin',
          nombreGerencia: 'Gerencia Guillermo',
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
          id_cliente: 3,
          nombreCliente: 'Carlos Alberto Hernández Ramírez',
          nombreGrupo: 'Planeacion Agustin',
          nombreGerencia: 'Gerencia Guillermo',
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

  showFilterMenu() {
    this.filterMenuOpen = !this.filterMenuOpen;
  }
  onSelectedUser(event: any) {
    alert('no implementado' + event);
    return;
  }
}
