import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/login/services/AuthService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private authService = inject(AuthService);
  isSidebarVisible = false;
  nombreUsuario = localStorage.getItem('nombreusuario') || 'quien eres?';

  items: MenuItem[] = [
    {
      label: 'Altas',
      expanded: true,
      items: [
        {
          label: 'Pagos',
          icon: 'pi pi-fw pi-credit-card',
          routerLink: '/dashboard/pagos',
          command: () => this.toggleSidebar(),
        },
        {
          label: 'Solicitud de prestamo',
          icon: 'pi pi-fw pi-file-plus',
          routerLink: '/dashboard/loan-request',
          command: () => this.toggleSidebar(),
        },
      ],
    },
    {
      label: 'Consultas',
      items: [
        {
          label: 'Listado de solicitudes',
          icon: 'pi pi-fw pi-file',
          routerLink: '/dashboard/request-list',
          command: () => this.toggleSidebar(),
        },
        {
          label: 'VIEW REQUEST TESTING',
          icon: 'pi pi-fw pi-file',
          routerLink: '/dashboard/loan-request/view/000018',
          command: () => this.toggleSidebar(),
        },
      ],
    },
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-fw pi-power-off',
      command: () => this.logout(),
    },
  ];

  menuItems: MenuItem[] = [
    { icon: 'pi pi-bars', command: () => this.toggleSidebar() },
    // {
    //   label: 'Altas',
    //   icon: 'pi pi-fw pi-plus',
    //   items: [
    // { label: 'Clientes', icon: 'pi pi-fw pi-money-bill' },
    // { label: 'Avales', icon: 'pi pi-fw pi-money-bill' },
    // { label: 'Prestamos', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Pagos', icon: 'pi pi-fw pi-user-plus', routerLink: '/pagos' },
    // { label: 'Usuarios', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Grupos', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Plazos', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Definicion de multas', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Cortes', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Recalculo de intereses', icon: 'pi pi-fw pi-user-plus' },
    // { label: 'Domicilios', icon: 'pi pi-fw pi-user-plus' },
    //   ],
    // },
    // {
    //   label: 'Buscar',
    //   icon: 'pi pi-fw pi-search',
    //   items: [
    //     { label: 'Clientes', icon: 'pi pi-fw pi-money-bill' },
    //     { label: 'Avales', icon: 'pi pi-fw pi-money-bill' },
    //     { label: 'Prestamos', icon: 'pi pi-fw pi-user-plus' },
    //     { label: 'Pagos', icon: 'pi pi-fw pi-user-plus' },
    //     { label: 'Usuarios', icon: 'pi pi-fw pi-user-plus' },
    //     { label: 'Domicilios', icon: 'pi pi-fw pi-user-plus' },
    //   ],
    // },
    // {
    //   label: 'Cuentas por cobrar',
    //   icon: 'pi pi-fw pi-money-bill',
    //   items: [
    //     { label: 'Alta de movimientos', icon: 'pi pi-fw pi-money-bill' },
    //     { label: 'Reconciliacion interna', icon: 'pi pi-fw pi-money-bill' },
    //     { label: 'Nuevo concepto', icon: 'pi pi-fw pi-money-bill' },
    //   ],
    // },
    // {
    //   label: 'Cátalogos',
    //   icon: 'pi pi-fw pi-book',
    //   items: [
    //     { label: 'Clientes', icon: 'pi pi-fw pi-user' },
    //     { label: 'Avales', icon: 'pi pi-fw pi-user' },
    //     { label: 'Conceptos CxC', icon: 'pi pi-fw pi-user' },
    //     { label: 'Administrar grupos', icon: 'pi pi-fw pi-user' },
    //   ],
    // },
    // {
    //   label: 'Movimientos',
    //   icon: 'pi pi-fw pi-arrow-right-arrow-left',
    //   items: [
    //     { label: 'Préstamos', icon: 'pi pi-fw pi-user' },
    //     { label: 'Pagos', icon: 'pi pi-fw pi-user' },
    //     { label: 'Pagos adelantados', icon: 'pi pi-fw pi-user' },
    //     { label: 'Cortes', icon: 'pi pi-fw pi-user' },
    //     { label: 'Multas', icon: 'pi pi-fw pi-user' },
    //     { label: 'Cuentas por cobrar', icon: 'pi pi-fw pi-user' },
    //     { label: 'Reonciliación interna', icon: 'pi pi-fw pi-user' },
    //   ],
    // },
    // {
    //   label: 'Reportes',
    //   icon: 'pi pi-fw pi-chart-bar',
    //   items: [
    //     { label: 'Cobranza diaria', icon: 'pi pi-fw pi-user' },
    //     { label: 'Pagos', icon: 'pi pi-fw pi-user' },
    //     { label: 'Cobranza semanal', icon: 'pi pi-fw pi-user' },
    //     { label: 'Estado de cuenta cliente', icon: 'pi pi-fw pi-user' },
    //     { label: 'Detallado de préstamos', icon: 'pi pi-fw pi-user' },
    //     { label: 'Comisiones', icon: 'pi pi-fw pi-user' },
    //     { label: 'Calculo de mora', icon: 'pi pi-fw pi-user' },
    //     { label: 'Reporte de mora', icon: 'pi pi-fw pi-user' },
    //     { label: 'Reporte de inversión real', icon: 'pi pi-fw pi-user' },
    //   ],
    // },
    // {
    //   label: 'Seguridad',
    //   icon: 'pi pi-fw pi-unlock',
    //   items: [{ label: 'Permisos', icon: 'pi pi-fw pi-user-plus' }],
    // },
    // {
    //   label: 'Cerrar sesión',
    //   icon: 'pi pi-fw pi-power-off',
    //   command: () => this.logout(),
    // },
  ];

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout(): void {
    this.authService.logout();
  }
}
