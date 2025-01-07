import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';

import { Requests } from './types/requests';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { RequestList } from './services/request-list.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

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
  ],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
})
export class RequestListComponent implements OnInit {
  requests = signal<Requests[]>([]);
  menuItems = signal<MenuItem[]>([]);
  private requestList = inject(RequestList);
  readonly router = inject(Router);
  showLoadingModal = false;
  sortOptions!: { label: string; value: string }[];
  sortOrder!: number;
  sortField!: string;

  ngOnInit(): void {
    this.menuItems.set([
      {
        label: 'Status',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Revision',
          },
          {
            label: 'Aprobado',
          },
          {
            label: 'Rechazado',
          },
          {
            label: 'Actualización',
          },
        ],
      },
      {
        label: 'Fecha',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'Nuevos',
          },
          {
            label: 'Viejos',
          },
        ],
      },
      {
        label: 'Cantidad',
        icon: 'pi pi-dollar',
        items: [
          {
            label: 'Mayor',
          },
          {
            label: 'Menor',
          },
        ],
      },
    ]);
    this.showLoadingModal = true;
    this.requestList.getRequestsList().subscribe({
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
}
