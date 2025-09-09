import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { CustomerLoanStatusService } from './services/customerLoanStatus.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerLoanStatus } from './types/customerLoanStatus.type';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

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
    CardModule,
  ],

  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css'],
})
export class RequestStatusComponent {
  router = inject(Router);
  requestForm!: FormGroup;
  qrVisible = false;
  isProdEnv = environment.PRODUCTION;
  environmentName = environment.ENV_NAME;
  loading = signal<boolean>(false);
  visible = signal<boolean>(false);
  error = signal<string>('');
  loanRequestInfo = signal<CustomerLoanStatus | null>(null);
  customerLoanStatusService = inject(CustomerLoanStatusService);
  readonly #destroyRef$ = inject(DestroyRef);
  qrImage: string = '';
  phoneNumber: string = '';

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
    this.qrImage = this.isProdEnv
      ? './assets/ALTA_PROD.png'
      : './assets/ALTA.png';
    this.phoneNumber = this.isProdEnv ? '3339829205' : '3313008582';
  }

  requestStatus() {
    this.loading.set(true);
    const loanId = this.requestForm.get('loanrequestid')?.value;
    const customerLastName = this.requestForm.get('customerlastname')?.value;

    this.customerLoanStatusService
      .getCustomerLoanStatus(loanId, customerLastName)
      .pipe(takeUntilDestroyed(this.#destroyRef$))
      .subscribe({
        next: (responseData) => {
          this.loanRequestInfo.set(responseData);
          this.visible.set(true);
          this.loading.set(false);
        },
        error: () => {
          this.loanRequestInfo.set(null);
          this.visible.set(true);
          this.loading.set(false);
        },
      });
  }

  goToLanding() {
    this.router.navigate(['/']);
  }
}
