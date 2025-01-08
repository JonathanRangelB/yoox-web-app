import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

import { Requests } from './types/requests';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RequestList } from './services/request-list.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';

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
  #requestList = inject(RequestList);
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

  ngOnInit(): void {
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
    this.showLoadingModal = true;
    this.#requestList
      .getRequestsList(this.first, this.rows)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (data) => {
          this.requests.set(data);
          this.showLoadingModal = false;
        },
        error: () => {
          this.requests.set([]);
          this.showLoadingModal = false;
        },
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
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  searchbyStatus(
    status: 'ACTUALIZAR' | 'APROBADO' | 'EN REVISION' | 'RECHAZADO'
  ) {
    this.showLoadingModal = true;
    this.#requestList
      .getRequestsList(this.first, this.rows, status)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: () => {},
        error: () => {
          this.showLoadingModal = false;
          this.#messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrio un error',
            life: 3000,
          });
        },
      });
  }

  search() {
    if (this.searchInputValue.length < 1) return;
    if (this.searchTerm === 'cliente') {
      const nombreCliente = this.searchInputValue;
      this.#requestList
        .getRequestsList(this.first, this.rows, undefined, nombreCliente)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe({
          next: () => {},
          error: () => {
            this.showLoadingModal = false;
            this.#messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrio un error',
              life: 3000,
            });
          },
        });
    } else {
      const folio = this.searchInputValue;
      this.#requestList
        .getRequestsList(this.first, this.rows, undefined, undefined, folio)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe({
          next: () => {},
          error: () => {
            this.showLoadingModal = false;
            this.#messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrio un error',
              life: 3000,
            });
          },
        });
    }
  }
}
