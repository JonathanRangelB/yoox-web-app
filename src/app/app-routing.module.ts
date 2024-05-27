import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuardGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren() {
      return import('./landing/landing.module').then((m) => m.LandingModule);
    },
  },
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
    // component: NotFoundComponent,
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundModule),
  },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
