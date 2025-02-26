import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
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
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
  providers: [MessageService],
})
export class RequestListComponent implements OnInit {
  requests = signal<Requests[]>([]);
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
  loggedUser?: User;
  selectedMenuItem: MenuItem | null = null;
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
                command: () =>
                  this.searchByStatus({
                    status: LoanStatusEnum.revision,
                    userIdFilter: this.userIdFilter,
                  }),
              },
              {
                label: 'Aprobado',
                command: () =>
                  this.searchByStatus({
                    status: LoanStatusEnum.aprobado,
                    userIdFilter: this.userIdFilter,
                  }),
              },
              {
                label: 'Rechazado',
                command: () =>
                  this.searchByStatus({
                    status: LoanStatusEnum.rechazado,
                    userIdFilter: this.userIdFilter,
                  }),
              },
              {
                label: 'Actualizar',
                command: () =>
                  this.searchByStatus({
                    status: LoanStatusEnum.actualizar,
                    userIdFilter: this.userIdFilter,
                  }),
              },
              {
                separator: true,
              },
              {
                label: 'Mostrar todos',
                command: () =>
                  this.searchByStatus({
                    status: LoanStatusEnum.todos,
                    userIdFilter: this.userIdFilter,
                  }),
              },
            ],
          },
          {
            label: 'Agente',
            icon: 'pi pi-user',
            items: this.usersList(),
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
    this.loggedUser = JSON.parse(localStorage.getItem('user')!);
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

  inputSearch() {
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
          this.requestUserList.update(() => data.usersList);
          // TODO: agregar un if para solo construir el menu de usuarios solo si el rol de usuario es diferente a 'Cobrador'
          this.generateUsersList();
          this.totalRecords = data.loanRequests[0].CNT;
          console.log(data.loanRequests[0].CNT);
        },
        error: (errorRes: HttpErrorResponse) => {
          this.showLoadingModal = false;
          this.#messageService.add({
            severity: 'error',
            summary: errorRes.error?.message || errorRes.name,
            detail: errorRes.error?.error || errorRes.statusText,
            life: 3000,
          });
        },
      });
  }

  // TODO: cambiar el 'command' para que cada item pueda mandar llamar la busqueda de solicitudes,
  // creo que lo mejor seria guardar el nombre del agente por el cual se desea filtar y ya solo hacer
  // la llamada a la ejecucion de la funcion de busqueda para no tener que mandarle parametros,
  // pero bueno, es una opcion porque en si seria lo mismo que mancar llamar la funcion de busqueda con parametros,
  // pero mas que nada es para hacer que la funcion sea lo mas generica posible asi para que sea mas mantenible
  generateUsersList() {
    this.usersList.update(() => [
      ...this.requestUserList().map((user): MenuItem => {
        return {
          label: toTitleCaseAndSplit(user.NOMBRE),
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
}
