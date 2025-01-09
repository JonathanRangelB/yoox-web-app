import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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

import { RequestListOptions, Requests } from './types/requests';
import { RequestListService } from './services/request-list.service';

@Component({
  selector: 'app-request-list',
  imports: [
    CommonModule,
    CardModule,
    DialogModule,
    ProgressSpinnerModule,
    TagModule,
    DataViewModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    PaginatorModule,
    ToastModule,
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
  providers: [MessageService],
})
export class RequestListComponent implements OnInit {
  requests = signal<Requests[]>([]);
  menuItems = signal<MenuItem[]>([]);
  first: number = 0;
  rows: number = 5;
  destroyRef$ = inject(DestroyRef);
  #requestListService = inject(RequestListService);
  readonly router = inject(Router);
  readonly #messageService = inject(MessageService);
  showLoadingModal = false;
  sortOptions!: { label: string; value: string }[];
  sortOrder!: number;
  sortField!: string;
  searchTerm: 'cliente' | 'folio' = 'cliente';
  searchTermIcon: string = 'pi pi-user';
  totalRecords: number = 0;
  searchInputValue = '';
  searchStatus = '';

  ngOnInit(): void {
    this.generateMenu();
    this.showLoadingModal = true;
    this.getRequestListItems({
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
    });
  }

  handleClick(solicitud: Requests) {
    console.log(solicitud);
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

  searchbyStatus(
    status: 'ACTUALIZAR' | 'APROBADO' | 'EN REVISION' | 'RECHAZADO' | 'TODOS'
  ) {
    this.showLoadingModal = true;
    this.searchStatus = status === 'TODOS' ? '' : status;
    this.getRequestListItems({
      offSetRows: this.first,
      fetchRowsNumber: this.rows,
    });
  }

  search() {
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
    this.#requestListService
      .getRequestsList(options)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (data) => {
          this.showLoadingModal = false;
          this.requests.update(() => data);
          this.totalRecords = data[0].CNT;
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          this.showLoadingModal = false;
          this.#messageService.add({
            severity: 'error',
            summary: httpErrorResponse.error?.message || httpErrorResponse.name,
            detail:
              httpErrorResponse.error?.error || httpErrorResponse.statusText,
            life: 3000,
          });
        },
      });
  }

  generateMenu() {
    this.menuItems.set([
      {
        label: 'Status',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Revision',
            command: () => this.searchbyStatus('EN REVISION'),
          },
          {
            label: 'Aprobado',
            command: () => this.searchbyStatus('APROBADO'),
          },
          {
            label: 'Rechazado',
            command: () => this.searchbyStatus('RECHAZADO'),
          },
          {
            label: 'Actualización',
            command: () => this.searchbyStatus('ACTUALIZAR'),
          },
          {
            separator: true,
          },
          {
            label: 'Mostrar todos',
            command: () => this.searchbyStatus('TODOS'),
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
    ]);
  }
}
