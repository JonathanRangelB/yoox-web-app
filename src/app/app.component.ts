import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private nwUpdate: UpdateService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
