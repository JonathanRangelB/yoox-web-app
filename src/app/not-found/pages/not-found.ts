import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.scss'],
  standalone: false,
})
export class NotFoundComponent {
  constructor(private router: Router) {}
  goBack() {
    this.router.navigate(['/']);
  }
}
