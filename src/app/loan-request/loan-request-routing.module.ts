import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanComponent } from './pages/loan/new-loan.component';

const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: 'new',
    component: LoanComponent,
  },
  {
    path: 'update/:loanId',
    component: LoanComponent,
  },
  {
    path: 'view/:loanId',
    component: LoanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanRequestRoutingModule {}
