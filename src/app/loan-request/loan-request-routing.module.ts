import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLoanComponent } from './pages/new-loan/new-loan.component';
import { UpdateLoanComponent } from './pages/update-loan/update-loan.component';
import { ViewLoanComponent } from './pages/view-loan/view-loan.component';

const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: 'new',
    component: NewLoanComponent,
  },
  {
    path: 'update',
    component: UpdateLoanComponent,
  },
  {
    path: 'view',
    component: ViewLoanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoanRequestRoutingModule {}
