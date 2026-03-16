import { Component, inject, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/login/services/AuthService';
import { version } from '../../../package.json';
import { DesktopAppService } from './services/desktop-app.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private desktopAppService = inject(DesktopAppService);

  isSidebarVisible = false;
  nombreUsuario = localStorage.getItem('nombreusuario') || 'quien eres?';
  appVersion = version;

  menuItems = computed<MenuItem[]>(() => [
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
          label: 'Agenda de cobro',
          icon: 'pi pi-fw pi-calendar',
          routerLink: '/dashboard/cobro-agenda',
          command: () => this.toggleSidebar(),
        },
      ],
    },
    {
      label: 'Desktop APP',
      icon: 'pi pi-fw pi-desktop',
      url: this.desktopAppService.desktopAppUrl(),
    },
    {
      label: 'Documentación',
      icon: 'pi pi-fw pi-book',
      url: 'https://yoox-docs.vercel.app/',
    },
  ]);

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout(): void {
    this.authService.logout();
  }
}
