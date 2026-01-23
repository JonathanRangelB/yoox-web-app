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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { AgendaService } from './services/agenda.service';
import {
  AgendaDeCobro,
  DatosAgenda,
  Group,
} from './interfaces/cobro-agenda.interface';
import { getUserFromLocalStorage } from 'src/app/shared/utils/functions.utils';

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
  agendaService = inject(AgendaService);
  selectedRecord: DatosAgenda | null = null;
  datosAgenda: DatosAgenda[] = [];
  respaldoDatosAgenda: DatosAgenda[] = [];
  loading: boolean = false;
  filterMenuOpen: boolean = false;
  users = signal<Group[]>([]);
  selectedUser: Group | undefined = undefined;
  currentUser = getUserFromLocalStorage();
  groups = signal<Group[]>([]);
  selectedGroup: Group | undefined = undefined;
  management = signal<Group[]>([]);
  selectedManagement: Group | undefined = undefined;
  userDropdown = viewChild<Dropdown>('userDropdown');
  groupDropdown = viewChild<Dropdown>('groupdropdown');
  managementDropdown = viewChild<Dropdown>('managementdropdown');
  sidebar = viewChild<Sidebar>('sidebar');

  ngOnInit(): void {
    this.requestAgendaData();
  }

  requestAgendaData(): void {
    this.loading = true;
    this.sidebar()!.close(new Event('close'));
    this.agendaService
      .getOutstandingCollectionsReport({
        ...(this.selectedUser && {
          userIdFilter: this.selectedUser.ID,
        }),
        ...(this.selectedGroup && {
          groupIdFilter: this.selectedGroup.ID,
        }),
        ...(this.selectedManagement && {
          managementIdFilter: this.selectedManagement.ID,
        }),
      })
      .subscribe({
        next: (data) => this.fillFiedlsWithData(data),
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
    this.selectedGroup = undefined;
    this.selectedManagement = undefined;
  }

  onSelectedGroup(event: any) {
    this.selectedGroup = event.value;
    this.selectedUser = undefined;
    this.selectedManagement = undefined;
  }

  onSelectedManagement(event: any) {
    this.selectedManagement = event.value;
    this.selectedUser = undefined;
    this.selectedGroup = undefined;
  }

  fillFiedlsWithData(data: AgendaDeCobro) {
    this.datosAgenda = data.datosAgenda;
    this.respaldoDatosAgenda = [...data.datosAgenda];
    this.users.set(data.usersList);
    this.groups.set(data.groups);
    this.management.set(data.management);
    this.loading = false;
  }

  restoreDefaults() {
    this.userDropdown()?.clear();
    this.groupDropdown()?.clear();
    this.managementDropdown()?.clear();
    this.selectedUser = undefined;
    this.selectedGroup = undefined;
    this.selectedManagement = undefined;
  }

  handleError(error: Error) {
    this.datosAgenda = [];
    this.loading = false;
    console.error('Error loading data:', error.message);
  }
}
