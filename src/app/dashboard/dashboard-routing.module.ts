import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'pagos',
        pathMatch: 'full',
      },
      {
        path: 'pagos',
        loadChildren: () =>
          import('../pagos/pagos.module').then((m) => m.PagosModule),
      },
      {
        path: 'loan-request',
        loadChildren: () =>
          import('../loan-request/loan-request.module').then(
            (m) => m.LoanRequestModule
          ),
      },
      {
        path: 'request-list',
        loadComponent: () =>
          import('../request-list/request-list.component').then(
            (c) => c.RequestListComponent
          ),
      },
      { path: '**', redirectTo: 'not-found' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
