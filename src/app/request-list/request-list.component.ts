import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
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
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import {
  LoanStatusEnum,
  RequestListOptions,
  Requests,
  SearchOptions,
  User,
} from './types/requests';
import { RequestListService } from './services/request-list.service';
import { toTitleCaseAndSplit } from '../shared/utils/functions.utils';
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownModule,
} from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-request-list',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DataViewModule,
    DialogModule,
    InputTextModule,
    MenubarModule,
    PaginatorModule,
    ProgressSpinnerModule,
    TagModule,
    ToastModule,
    DropdownModule,
    SidebarModule,
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
  providers: [MessageService],
})
export class RequestListComponent implements OnInit {
  requests = signal<Requests[]>([]);
  unfilteredRequests: Requests[] = [];
  usersList = signal<MenuItem[]>([]);
  requestUserList = signal<User[]>([]);
  selectedUser?: User;
  readonly #destroyRef$ = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  readonly #requestListService = inject(RequestListService);
  readonly router = inject(Router);
  first: number = 0;
  rows: number = 5;
  searchInputValue = '';
  searchStatus = '';
  searchTerm: 'cliente' | 'folio' = 'cliente';
  searchTermIcon: string = 'pi pi-user';
  showLoadingModal = false;
  sortField!: string;
  sortOptions!: { label: string; value: string }[];
  sortOrder!: number;
  totalRecords: number = 0;
  userIdFilter?: number;
  selectedMenuItem: MenuItem | null = null;
  selectedStatusItem: string | null = null;
  showFilterMenu: boolean = true;
  filterRequest: boolean = false;
  agentDropdown = viewChild<Dropdown>('agentDropdown');
  groupDropdown = viewChild<Dropdown>('groupDropdown');
  managerDropdown = viewChild<Dropdown>('managerDropdown');
  fechaDropdown = viewChild<Dropdown>('fechaDropdown');
  cantidadDropdown = viewChild<Dropdown>('cantidadDropdown');

  menuItems = computed(() => {
    return [
      {
        label: 'filtar por...',
        icon: 'pi pi-filter',
        items: [
          {
            label: 'Status',
            icon: 'pi pi-chart-bar',
            items: [
              {
                label: 'En Revision',
                command: () => this.selectStatusItem(LoanStatusEnum.revision),
                icon:
                  this.selectedStatusItem === LoanStatusEnum.revision
                    ? 'pi pi-check'
                    : '',
                status: LoanStatusEnum.revision,
              },
              {
                label: 'Aprobado',
                command: () => this.selectStatusItem(LoanStatusEnum.aprobado),
                icon:
                  this.selectedStatusItem === LoanStatusEnum.aprobado
                    ? 'pi pi-check'
                    : '',
                status: LoanStatusEnum.aprobado,
              },
              {
                label: 'Rechazado',
                command: () => this.selectStatusItem(LoanStatusEnum.rechazado),
                icon:
                  this.selectedStatusItem === LoanStatusEnum.rechazado
                    ? 'pi pi-check'
                    : '',
                status: LoanStatusEnum.rechazado,
              },
              {
                label: 'Actualizar',
                command: () => this.selectStatusItem(LoanStatusEnum.actualizar),
                icon:
                  this.selectedStatusItem === LoanStatusEnum.actualizar
                    ? 'pi pi-check'
                    : '',
                status: LoanStatusEnum.actualizar,
              },
              {
                separator: true,
              },
              {
                label: 'Mostrar todos',
                command: () => this.selectStatusItem(LoanStatusEnum.todos),
                icon:
                  this.selectedStatusItem === LoanStatusEnum.todos
                    ? 'pi pi-check'
                    : '',
                status: LoanStatusEnum.todos,
              },
            ],
          },
          {
            // necesito inyectar este elemento para indicarle al menu que aqui hay algo especial
            // de tipo dropdown, en el template se valida este atributo para renderizar el componente
            // el resto de elementos se renderizan como opciones normales del menu
            dropdown: true,
          },
        ],
      },
      {
        label: 'Ordenar por...',
        icon: 'pi pi-sort',
        items: [
          {
            label: 'Fecha',
            icon: 'pi pi-calendar',
            items: [
              {
                label: 'Recientes',
                command: () => this.orderbyDate('desc'),
              },
              {
                label: 'Antiguos',
                command: () => this.orderbyDate('asc'),
              },
            ],
          },
          {
            label: 'Cantidad',
            icon: 'pi pi-dollar',
            items: [
              {
                label: 'Mayor',
                command: () => this.orderbyAmount('desc'),
              },
              {
                label: 'Menor',
                command: () => this.orderbyAmount('asc'),
              },
            ],
          },
        ],
      },
    ];
  });

  ngOnInit(): void {
    this.showLoadingModal = true;
    this.getRequestListItems({
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
    });
  }

  handleClick(solicitud: Requests) {
    const loan_request = solicitud.request_number;
    this.router.navigate([`/dashboard/loan-request/view/${loan_request}`]);
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
    this.requests.update(() =>
      this.requests().sort((a, b) => {
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
  }

  orderbyAmount(direction: 'asc' | 'desc') {
    this.requests.update(() =>
      this.requests().sort((a, b) => {
        if (direction === 'asc') {
          return a.cantidad_prestada - b.cantidad_prestada;
        }
        return b.cantidad_prestada - a.cantidad_prestada;
      })
    );
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

  onPageChange(event: PaginatorState) {
    this.showLoadingModal = true;
    this.rows = event.rows!;
    this.first = event.first!;
    this.getRequestListItems({
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
    });
  }

  searchByStatus({ status, userIdFilter }: SearchOptions) {
    this.showLoadingModal = true;
    this.searchStatus = status === LoanStatusEnum.todos ? '' : status;
    // necesitamos resetear el paginador colocando en 0 el offset/first
    // para los casos que se estaba en una pagina muy arriba para
    // asegurar obtener un resultado desde el inicio de la paginacion
    this.first = 0;
    this.getRequestListItems({
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
      ...(status && { status: this.searchStatus }),
      ...(userIdFilter && { userIdFilter }),
    });
  }

  inputSearch(event: KeyboardEvent | MouseEvent) {
    if (event instanceof KeyboardEvent) {
      if (event.code !== 'Enter') return;
    }
    if (this.searchInputValue.length < 1) return;
    this.showLoadingModal = true;
    this.searchStatus = '';
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

  getRequestListItems(options: RequestListOptions) {
    if (this.searchStatus) {
      options.status = this.searchStatus;
    }
    if (this.selectedUser?.ID) {
      options.userIdFilter = this.selectedUser?.ID;
    }
    this.#requestListService
      .getRequestsList(options)
      .pipe(takeUntilDestroyed(this.#destroyRef$))
      .subscribe({
        next: (data) => {
          this.showLoadingModal = false;
          this.requests.update(() => data.loanRequests);
          this.requestUserList.update(() =>
            data.usersList.sort((a, b) => a.ID - b.ID)
          );
          this.filterRequest = false;
          // this.generateUsersList();
          this.totalRecords = data.loanRequests[0].CNT;
          this.unfilteredRequests = [...data.loanRequests];
        },
        error: (errorRes: HttpErrorResponse) => {
          this.showLoadingModal = false;
          this.filterRequest = false;
          this.#messageService.add({
            severity: 'error',
            summary: errorRes.error?.message || errorRes.name,
            detail: errorRes.error?.error || errorRes.statusText,
            life: 3000,
          });
        },
      });
  }

  generateUsersList() {
    this.usersList.update(() => [
      ...this.requestUserList().map((user): MenuItem => {
        return {
          label: `${user.ID} - ${toTitleCaseAndSplit(user.NOMBRE)}`,
          icon:
            this.selectedMenuItem?.label === toTitleCaseAndSplit(user.NOMBRE)
              ? 'pi pi-check'
              : '',
          command: () => {
            this.selectedMenuItem = {
              label: toTitleCaseAndSplit(user.NOMBRE),
              icon: 'pi pi-check',
            };
            this.selectedUser = {
              NOMBRE: toTitleCaseAndSplit(user.NOMBRE),
              ID: user.ID,
            };
            return this.getRequestListItems({
              offSetRows: 0,
              fetchRowsNumber: this.rows,
              userIdFilter: user.ID,
              ...(this.searchStatus && { status: this.searchStatus }),
            });
          },
        };
      }),
      {
        separator: true,
      },
      {
        label: 'Mostrar todos',
        icon:
          this.selectedMenuItem?.label === 'Mostrar todos' ? 'pi pi-check' : '',
        command: () => {
          this.selectedMenuItem = {
            label: 'Mostrar todos',
            icon: 'pi pi-check',
          };
          this.selectedUser = undefined;
          return this.getRequestListItems({
            offSetRows: 0,
            fetchRowsNumber: this.rows,
            ...(this.searchStatus && { status: this.searchStatus }),
          });
        },
      },
    ]);
  }

  selectStatusItem(status: LoanStatusEnum) {
    this.selectedStatusItem = status;
    this.searchByStatus({ status, userIdFilter: this.userIdFilter });
  }

  userSelected(event: DropdownChangeEvent) {
    const user = event.value as User;
    this.selectedUser = user;
    this.showLoadingModal = true;
    this.getRequestListItems({
      offSetRows: 0,
      fetchRowsNumber: this.rows,
      ...(this.searchStatus && { status: this.searchStatus }),
    });
  }

  grupos = [
    { label: 'Grupo A Grupo A Grupo A ', value: 'grupoA' }, // maximo 24 caracteres en el label para que no aparezca el scroll horizontal
    { label: 'Grupo B', ID: 'grupoB' },
    { label: 'Grupo C', ID: 'grupoC' },
    { label: 'Grupo D', ID: 'grupoD' },
    { label: 'Grupo E', ID: 'grupoE' },
  ];

  gerencias = [
    { label: 'Gerencia Norte', ID: 'norte' },
    { label: 'Gerencia Sur', ID: 'sur' },
    { label: 'Gerencia Este', ID: 'este' },
  ];

  opcionesFecha = [
    { label: 'Recientes', value: 'recientes' },
    { label: 'Antiguos', value: 'antiguos' },
  ];

  opcionesCantidad = [
    { label: 'Mayor', value: 'mayor' },
    { label: 'Menor', value: 'menor' },
  ];

  selectedAgente: any = null;
  selectedGrupo: any = null;
  selectedGerencia: any = null;
  selectedOrdenFecha: any = null;
  selectedOrdenCantidad: any = null;

  onAgenteChange(event: any) {
    this.selectedAgente = this.selectedAgente = event.value;
  }

  onGrupoChange(event: any) {
    this.selectedGrupo = event.value;
  }

  onGerenciaChange(event: any) {
    this.selectedGerencia = event.value;
  }

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

  restoreDefaults() {
    this.agentDropdown()?.clear();
    this.groupDropdown()?.clear();
    this.managerDropdown()?.clear();
    this.selectedAgente = null;
    this.selectedGrupo = null;
    this.selectedGerencia = null;
  }

  restoreOrderDefaults() {
    this.fechaDropdown()?.clear();
    this.cantidadDropdown()?.clear();
    this.requests.update(() => [...this.unfilteredRequests]);
  }

  applySearchRules() {
    this.filterRequest = true;
    const options: RequestListOptions = {
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
      ...(this.selectedAgente && { userIdFilter: this.selectedAgente.ID }),
      ...(this.selectedGrupo && { groupIdFilter: this.selectedGrupo.ID }),
      ...(this.selectedGerencia && {
        managementIdFilter: this.selectedGerencia.ID,
      }),
    };
    this.getRequestListItems(options);
    this.restoreOrderDefaults();
  }
}
