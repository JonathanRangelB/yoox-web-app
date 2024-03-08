import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { LandingComponent } from './landing/landing.component';
import { authGuardGuard } from './pagos/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'pagos',
    canActivate: [authGuardGuard],
    loadChildren: () =>
      import('./pagos/pagos.module').then((m) => m.PagosModule),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
