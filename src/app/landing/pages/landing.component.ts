import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  title = 'YOOX web app';
  constructor(private router: Router) {}

  navigatetoLogin() {
    this.router.navigate(['/login']);
  }
}
