import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'yoox-web-app';

  constructor(private router: Router) {

  }
  navigatetoLogin() {
    this.router.navigate(['/login'])
  }
}
