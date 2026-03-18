import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import {
  Groups,
  LoanStatusEnum,
  Management,
  RequestList,
  RequestListOptions,
  Requests,
  User,
  State,
} from './types/requests';
import { RequestListService } from './services/request-list.service';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-request-list',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    MenubarModule,
    PaginatorModule,
    ProgressSpinnerModule,
    ScrollingModule,
    TagModule,
    ToastModule,
    DropdownModule,
    SidebarModule,
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestListComponent implements OnInit {
  readonly #destroyRef$ = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  readonly #requestListService = inject(RequestListService);
  readonly router = inject(Router);
  agentDropdown = viewChild<Dropdown>('agentDropdown');
  groupDropdown = viewChild<Dropdown>('groupDropdown');
  managerDropdown = viewChild<Dropdown>('managerDropdown');
  fechaDropdown = viewChild<Dropdown>('fechaDropdown');
  cantidadDropdown = viewChild<Dropdown>('cantidadDropdown');
  statusDropdown = viewChild<Dropdown>('statusDropdown');
  requests = signal<Requests[]>([]);
  requestUserList = signal<User[]>([]);
  groups = signal<Groups[]>([]);
  management = signal<Management[]>([]);
  unfilteredRequests: Requests[] = [];
  selectedGrupo: any = null;
  selectedAgente: any = null;
  selectedGerencia: any = null;
  selectedOrdenFecha: any = null;
  selectedOrdenCantidad: any = null;
  selectedStatus: any = null;
  searchInputValue = '';
  searchTerm: 'cliente' | 'folio' = 'cliente';
  searchTermIcon: string = 'pi pi-user';
  showLoadingModal = false;
  showFilterMenu: boolean = false;
  filterRequest: boolean = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 5;
  state!: State;

  ngOnInit(): void {
    this.showLoadingModal = true;
    this.state = this.#requestListService.recover();
    if (this.state.data.totalRecords > 0) {
      this.setRecoveredState();
      this.showLoadingModal = false;
    } else {
      this.getRequestListItems({
        offSetRows: this.first,
        fetchRowsNumber: this.rows,
      });
    }
  }

  // COMPONENT FUNCTIONS
  opcionesFecha = [
    { label: 'Recientes', value: 'recientes' },
    { label: 'Antiguos', value: 'antiguos' },
  ];

  opcionesCantidad = [
    { label: 'Mayor', value: 'mayor' },
    { label: 'Menor', value: 'menor' },
  ];

  opcionesStatus = [
    { label: 'En Revisión', value: LoanStatusEnum.revision },
    { label: 'Aprobado', value: LoanStatusEnum.aprobado },
    { label: 'Rechazado', value: LoanStatusEnum.rechazado },
    { label: 'Actualizar', value: LoanStatusEnum.actualizar },
  ];

  private setRecoveredState() {
    const { data, filters } = this.state;
    this.requests.set(data.loanRequests);
    this.requestUserList.set(data.usersList);
    this.groups.set(data.groups);
    this.management.set(data.management);
    this.filterRequest = false;
    this.totalRecords = data.totalRecords;
    this.unfilteredRequests = [...data.unfilteredRequests];
    this.selectedGerencia = filters.selectedGerencia;
    this.selectedGrupo = filters.selectedGrupo;
    this.selectedAgente = filters.selectedAgente;
    this.selectedStatus = filters.selectedStatus;
    this.selectedOrdenFecha = filters.selectedOrdenFecha;
    this.selectedOrdenCantidad = filters.selectedOrdenCantidad;
  }

  getSeverity(request: Requests) {
    switch (request.loan_request_status) {
      case 'APROBADO':
        return 'success';
      case 'EN REVISION':
        return 'warning';
      default:
        return 'danger';
    }
  }

  orderbyDate(direction: 'asc' | 'desc') {
    this.requests.update((requests) =>
      [...requests].sort((a, b) => {
        if (direction === 'asc') {
          return (
            new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
          );
        }
        return (
          new Date(b.created_date).getTime() -
          new Date(a.created_date).getTime()
        );
      })
    );
    this.state.data.loanRequests = this.requests();
  }

  orderbyAmount(direction: 'asc' | 'desc') {
    this.requests.update((requests) =>
      [...requests].sort((a, b) => {
        if (direction === 'asc') {
          return a.cantidad_prestada - b.cantidad_prestada;
        }
        return b.cantidad_prestada - a.cantidad_prestada;
      })
    );
    this.state.data.loanRequests = this.requests();
  }

  trackByRequestNumber(_: number, item: Requests): string {
    return item.request_number;
  }

  getRequestListItems(options: RequestListOptions) {
    this.#requestListService
      .getRequestsList(options)
      .pipe(takeUntilDestroyed(this.#destroyRef$))
      .subscribe({
        next: (data: RequestList) => {
          this.setSucessfullData(data);
        },
        error: (errorRes: HttpErrorResponse) => {
          this.setFailedData(errorRes);
        },
      });
  }

  private setFailedData(errorRes: HttpErrorResponse) {
    this.requests.set([]);
    this.unfilteredRequests = [];
    this.showLoadingModal = false;
    this.filterRequest = false;
    this.#requestListService.clean();
    this.#messageService.add({
      severity: 'error',
      summary: errorRes.error?.message || errorRes.name,
      detail: errorRes.error?.error || errorRes.status,
      life: 3000,
    });
  }

  private setSucessfullData(data: RequestList) {
    this.showLoadingModal = false;
    this.requests.set(data.loanRequests);
    this.requestUserList.set(data.usersList);
    this.groups.set(data.groups);
    this.management.set(data.management);
    this.filterRequest = false;
    this.totalRecords = data.loanRequests[0].CNT;
    this.unfilteredRequests = [...data.loanRequests];
    this.state = {
      filters: {},
      data: {
        ...data,
        totalRecords: this.totalRecords,
        unfilteredRequests: this.unfilteredRequests,
      },
    };
  }

  // EVENTS
  openRecord(solicitud: Requests) {
    const loan_request = solicitud.request_number;
    this.setStateFilters();
    this.#requestListService.save(this.state);
    this.router.navigate([`/dashboard/loan-request/view/${loan_request}`]);
  }

  changeSearchTerm() {
    this.searchTerm = this.searchTerm === 'cliente' ? 'folio' : 'cliente';
    this.searchTermIcon =
      this.searchTerm === 'cliente' ? 'pi pi-user' : 'pi pi-hashtag';
    this.#messageService.add({
      severity: 'info',
      summary: 'Cambiado',
      detail: `Busqueda por ${this.searchTerm}`,
      life: 3000,
    });
  }

  restoreDefaults() {
    this.agentDropdown()?.clear();
    this.groupDropdown()?.clear();
    this.managerDropdown()?.clear();
    this.statusDropdown()?.clear();
    this.selectedAgente = null;
    this.selectedGrupo = null;
    this.selectedGerencia = null;
    this.selectedStatus = null;
    this.setStateFilters();
  }

  restoreOrderDefaults() {
    this.fechaDropdown()?.clear();
    this.cantidadDropdown()?.clear();
    this.requests.update(() => [...this.unfilteredRequests]);
    this.state.data.loanRequests = this.requests();
  }

  applySearchRules() {
    this.filterRequest = true;
    const options: RequestListOptions = {
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
      ...(this.selectedStatus && { status: this.selectedStatus }),
      ...(this.selectedAgente && { userIdFilter: this.selectedAgente.ID }),
      ...(this.selectedGrupo && { groupIdFilter: this.selectedGrupo.ID }),
      ...(this.selectedGerencia && {
        managementIdFilter: this.selectedGerencia.ID,
      }),
    };
    this.setStateFilters();
    this.getRequestListItems(options);
    this.restoreOrderDefaults();
  }

  inputSearch(event: KeyboardEvent | MouseEvent) {
    if (event instanceof KeyboardEvent) {
      if (event.code !== 'Enter') return;
    }
    if (this.searchInputValue.length < 1) return;
    this.showLoadingModal = true;
    if (this.searchTerm === 'cliente') {
      const nombreCliente = this.searchInputValue;
      this.getRequestListItems({
        offSetRows: this.first,
        fetchRowsNumber: this.rows,
        nombreCliente,
      });
    } else {
      const folio = this.searchInputValue;
      this.getRequestListItems({
        offSetRows: this.first,
        fetchRowsNumber: this.rows,
        folio,
      });
    }
  }

  // Filtros
  onAgenteChange(event: any) {
    this.selectedAgente = this.selectedAgente = event.value;
    this.selectedGrupo = null;
    this.selectedGerencia = null;
  }

  onGrupoChange(event: any) {
    this.selectedGrupo = event.value;
    this.selectedAgente = null;
    this.selectedGerencia = null;
  }

  onGerenciaChange(event: any) {
    this.selectedGerencia = event.value;
    this.selectedAgente = null;
    this.selectedGrupo = null;
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.value;
  }

  // Ordenamiento
  onOrdenFechaChange(event: any) {
    this.selectedOrdenCantidad = null;
    switch (event.value) {
      case 'recientes':
        this.orderbyDate('desc');
        break;
      case 'antiguos':
        this.orderbyDate('asc');
        break;
    }
  }

  onOrdenCantidadChange(event: any) {
    this.selectedOrdenFecha = null;
    switch (event.value) {
      case 'menor':
        this.orderbyAmount('asc');
        break;
      case 'mayor':
        this.orderbyAmount('desc');
        break;
    }
  }

  setStateFilters() {
    this.state.filters = {
      selectedAgente: this.selectedAgente,
      selectedGrupo: this.selectedGrupo,
      selectedGerencia: this.selectedGerencia,
      selectedStatus: this.selectedStatus,
      selectedOrdenFecha: this.selectedOrdenFecha,
      selectedOrdenCantidad: this.selectedOrdenCantidad,
    };
  }
}
