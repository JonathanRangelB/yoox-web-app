import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { SpeedDialModule } from 'primeng/speeddial';

import { Requests } from './types/requests';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, CardModule, SpeedDialModule],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
})
export class RequestListComponent implements OnInit {
  solicitudes = signal<Requests[]>([]);
  dialItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.solicitudes.set([
      {
        requestNumber: '000001-RANGEL',
        amount: 5000,
        customerName: 'Jonathan',
        customerLastName: 'Rangel',
        customerSurName: 'Bernal',
        creationDate: new Date(),
        status: 'APROVADO',
      },
      {
        requestNumber: '000001-GARCIA',
        amount: 5000,
        customerName: 'Armando',
        customerLastName: 'Garcia',
        customerSurName: 'Hernandez',
        creationDate: new Date(),
        status: 'RECHAZADO',
      },
      {
        requestNumber: '000001-ANAYA',
        amount: 5000,
        customerName: 'Pedro',
        customerLastName: 'Anaya',
        customerSurName: 'Contreras',
        creationDate: new Date(),
        status: 'REVISION',
      },
      {
        requestNumber: '000001-PEREZ',
        amount: 5000,
        customerName: 'Jose Hernesto',
        customerLastName: 'Perez',
        customerSurName: 'Perez',
        creationDate: new Date(),
        status: 'REVISION',
      },
      {
        requestNumber: '000001-PEREZ',
        amount: 5000,
        customerName: 'Patricia',
        customerLastName: 'Perez',
        customerSurName: 'Flores',
        creationDate: new Date(),
        status: 'CANCELADO',
      },
      {
        requestNumber: '000001-RANGEL',
        amount: 5000,
        customerName: 'Jonathan',
        customerLastName: 'Rangel',
        customerSurName: 'Bernal',
        creationDate: new Date(),
        status: 'APROVADO',
      },
      {
        requestNumber: '000001-GARCIA',
        amount: 5000,
        customerName: 'Armando',
        customerLastName: 'Garcia',
        customerSurName: 'Hernandez',
        creationDate: new Date(),
        status: 'RECHAZADO',
      },
      {
        requestNumber: '000001-ANAYA',
        amount: 5000,
        customerName: 'Pedro',
        customerLastName: 'Anaya',
        customerSurName: 'Contreras',
        creationDate: new Date(),
        status: 'REVISION',
      },
      {
        requestNumber: '000001-PEREZ',
        amount: 5000,
        customerName: 'Jose Hernesto',
        customerLastName: 'Perez',
        customerSurName: 'Perez',
        creationDate: new Date(),
        status: 'REVISION',
      },
      {
        requestNumber: '000001-PEREZ',
        amount: 5000,
        customerName: 'Patricia',
        customerLastName: 'Perez',
        customerSurName: 'Flores',
        creationDate: new Date(),
        status: 'CANCELADO',
      },
      {
        requestNumber: '000001-RANGEL',
        amount: 5000,
        customerName: 'Jonathan',
        customerLastName: 'Rangel',
        customerSurName: 'Bernal',
        creationDate: new Date(),
        status: 'APROVADO',
      },
      {
        requestNumber: '000001-GARCIA',
        amount: 5000,
        customerName: 'Armando',
        customerLastName: 'Garcia',
        customerSurName: 'Hernandez',
        creationDate: new Date(),
        status: 'RECHAZADO',
      },
      {
        requestNumber: '000001-ANAYA',
        amount: 5000,
        customerName: 'Pedro',
        customerLastName: 'Anaya',
        customerSurName: 'Contreras',
        creationDate: new Date(),
        status: 'REVISION',
      },
      {
        requestNumber: '000001-PEREZ',
        amount: 5000,
        customerName: 'Jose Hernesto',
        customerLastName: 'Perez',
        customerSurName: 'Perez',
        creationDate: new Date(),
        status: 'REVISION',
      },
      {
        requestNumber: '000001-PEREZ',
        amount: 5000,
        customerName: 'Patricia',
        customerLastName: 'Perez',
        customerSurName: 'Flores',
        creationDate: new Date(),
        status: 'CANCELADO',
      },
    ]);

    this.dialItems.set([
      {
        tooltipOptions: {
          tooltipLabel: 'Add',
        },
        icon: 'pi pi-pencil',
        command: () => {
          alert('hola');
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Update',
        },
        icon: 'pi pi-refresh',
        command: () => {
          alert('hola');
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Delete',
        },
        icon: 'pi pi-trash',
        command: () => {
          alert('hola');
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Upload',
        },
        icon: 'pi pi-upload',
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Angular Website',
        },
        icon: 'pi pi-external-link',
        url: 'http://angular.io',
      },
    ]);
  }
}
