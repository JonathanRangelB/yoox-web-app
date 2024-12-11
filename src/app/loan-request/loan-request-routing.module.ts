import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLoanComponent } from './pages/new-loan/new-loan.component';

const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: 'new',
    component: NewLoanComponent,
  },
  {
    path: 'update/:loanId',
    component: NewLoanComponent,
  },
  {
    path: 'view/:loanId',
    component: NewLoanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanRequestRoutingModule {}
