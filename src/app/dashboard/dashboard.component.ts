import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/login/services/AuthService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
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
      ],
    },
    {
      label: 'Desktop APP',
      icon: 'pi pi-fw pi-desktop',
      url: 'https://www.mediafire.com/file/mg2citv3awjqs8r/InstaladorYOOX-Release-09-03-2025.msi/file', // de momento esto estara hardcodeado hasta que exista un endpoint para obtener la ultima version
    },
    {
      label: 'Documentación',
      icon: 'pi pi-fw pi-book',
      url: 'https://yoox-docs.vercel.app/',
    },
  ];

  menuItems: MenuItem[] = [
    { icon: 'pi pi-bars', command: () => this.toggleSidebar() },
  ];

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout(): void {
    this.authService.logout();
  }
}
