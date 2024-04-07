import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagosComponent } from './pages/pagos/pagos.component';
import { LayoutComponent } from './pages/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: PagosComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagosRoutingModule {}
