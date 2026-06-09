import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AgendaService } from './services/agenda.service';
import { ExcelExportService } from '../shared/services/excel-export.service';
import {
  AgendaDeCobro,
  DatosAgenda,
  Group,
} from './interfaces/cobro-agenda.interface';
import { getUserFromLocalStorage } from '../shared/utils/functions.utils';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './cobro-agenda.component.html',
  styleUrls: ['./cobro-agenda.component.css'],
})
export class CobroAgendaComponent implements OnInit {
  readonly #agendaService = inject(AgendaService);
  readonly #excelExportService = inject(ExcelExportService);
  readonly #messageService = inject(MessageService);
  selectedRecord: DatosAgenda | null = null;
  datosAgenda: DatosAgenda[] = [];
  respaldoDatosAgenda: DatosAgenda[] = [];
  loading: boolean = false;
  exporting: boolean = false;
  filterMenuOpen: boolean = false;
  users = signal<Group[]>([]);
  selectedUser: Group | undefined = undefined;
  currentUser = getUserFromLocalStorage();
  userDropdown = viewChild<Dropdown>('userDropdown');
  sidebar = viewChild<Sidebar>('sidebar');
  table = viewChild<Table>('dt');

  ngOnInit(): void {
    this.requestAgendaData();
  }

  requestAgendaData(): void {
    this.loading = true;
    this.sidebar()!.close(new Event('close'));
    this.#agendaService
      .getOutstandingCollectionsReport({
        ...(this.selectedUser && {
          userIdFilter: this.selectedUser.ID,
        }),
      })
      .subscribe({
        next: (data) => this.fillFieldsWithData(data),
        error: (error) => {
          this.handleError(error);
        },
      });
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
    this.requestAgendaData();
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
    this.selectedUser = event.value;
  }

  fillFieldsWithData(data: AgendaDeCobro) {
    this.datosAgenda = data.datosAgenda;
    this.respaldoDatosAgenda = [...data.datosAgenda];
    this.users.set(data.usersList);
    this.loading = false;
  }

  restoreDefaults() {
    this.userDropdown()?.clear();
    this.selectedUser = undefined;
  }

  async exportAll(): Promise<void> {
    if (this.respaldoDatosAgenda.length === 0) return;
    this.exporting = true;
    const dateStr = new Date().toISOString().split('T')[0];
    await this.#excelExportService.exportAgendaToExcel(
      this.respaldoDatosAgenda,
      `agenda-cobro-completa_${dateStr}`
    );
    this.exporting = false;
  }

  async exportFiltered(): Promise<void> {
    const filtered = this.table()?.filteredValue as DatosAgenda[] | undefined;
    const dataToExport = filtered ?? this.datosAgenda;
    if (dataToExport.length === 0) {
      this.#messageService.add({
        severity: 'warn',
        summary: 'No hay datos para exportar',
        detail:
          'Tabla vacía o filtros aplicados no coinciden con ningún registro.',
        life: 3000,
      });
      return;
    }
    this.exporting = true;
    const dateStr = new Date().toISOString().split('T')[0];
    await this.#excelExportService.exportAgendaToExcel(
      dataToExport,
      `agenda-cobro-filtrada_${dateStr}`
    );
    this.exporting = false;
  }

  handleError(error: Error) {
    this.datosAgenda = [];
    this.loading = false;
    console.error('Error loading data:', error.message);
  }
}
