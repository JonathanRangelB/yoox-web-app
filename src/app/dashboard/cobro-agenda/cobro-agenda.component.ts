import { Component, inject, OnInit, signal } from '@angular/core';
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
import { AgendaService } from './services/agenda.service';
import {
  AgendaDeCobro,
  DatosAgenda,
  Group,
} from './interfaces/cobro-agenda.interface';

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

  ngOnInit(): void {
    this.loadCobrosAgenda();
  }

  loadCobrosAgenda(): void {
    this.loading = true;

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
        error: () => {
          this.handleError();
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
    this.selectedUser = event.value;
    this.loadCobrosAgenda();
  }

  onSelectedGroup(event: any) {
    this.selectedGroup = event.value;
    this.loadCobrosAgenda();
  }

  onSelectedManagement(event: any) {
    this.selectedManagement = event.value;
    this.loadCobrosAgenda();
  }

  fillFiedlsWithData(data: AgendaDeCobro) {
    this.datosAgenda = data.datosAgenda;
    this.respaldoDatosAgenda = [...data.datosAgenda];
    this.users.set(data.usersList);
    this.groups.set(data.groups);
    this.management.set(data.management);
    this.loading = false;
  }

  handleError() {
    this.datosAgenda = [];
    this.loading = false;
  }
}
