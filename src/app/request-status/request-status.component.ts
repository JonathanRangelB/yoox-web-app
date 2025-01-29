import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

interface LoanRequestInfo {
  informacion: string;
}

@Component({
  selector: 'app-request-status',
  standalone: true,
  imports: [
    CommonModule,
    PanelModule,
    ButtonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DialogModule,
  ],

  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css'],
})
export class RequestStatusComponent {
  requestForm!: FormGroup;
  isProdEnv = environment.PRODUCTION;
  environmentName = environment.ENV_NAME;
  loading = signal<boolean>(false);
  visible = signal<boolean>(false);
  error = signal<string>('');
  loanRequestInfo = signal<LoanRequestInfo>({ informacion: '' });

  constructor() {
    this.requestForm = new FormGroup({
      loanrequestid: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Z0-9]{6}$'),
      ]),
      customerlastname: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  requestStatus() {
    this.loading.set(true);
    setTimeout(() => {
      this.loanRequestInfo.set({
        informacion: 'la solicitud fue encontrada en nuestros registros',
      });
      this.visible.set(true);
      this.loading.set(false);
    }, 1000);
  }
}
