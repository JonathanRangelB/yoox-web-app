/* eslint-disable no-useless-escape */
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { InputNumberInputEvent } from 'primeng/inputnumber';
import {
  days,
  estadosDeLaRepublica,
  plazos,
  tiposCalle,
} from '../../utils/consts';
import {
  curpValidator,
  emailValidator,
  lengthValidator,
} from '../../utils/customValidators';
import { S3BucketService } from '../../services/s3-bucket.service';
import { BehaviorSubject, skip, Subject, takeUntil } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { InputSwitchChangeEvent } from 'primeng/inputswitch';

interface dropDownCollection {
  name: string;
  value: string;
}

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css'],
})
export class NewLoanComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  fb = inject(FormBuilder);
  cs = inject(ConfirmationService);
  ms = inject(MessageService);
  s3 = inject(S3BucketService);
  destroy$ = new Subject();
  position: string = 'bottom';
  mainForm: FormGroup;
  tiposCalle: dropDownCollection[] = tiposCalle;
  estadosDeLaRepublica: dropDownCollection[] = estadosDeLaRepublica;
  plazos: dropDownCollection[] = plazos;
  semanasDePlazo: number | undefined;
  fechaInicial: Date | undefined;
  fechaFinal: string | null = null;
  fechaMinima: Date = new Date();
  diaDeLaSemana: string | null = null;
  days: string[] = days;
  cantidadIngresada: number = 0;
  tasaDeInteres: number = 0;
  totalAPagar: number = 0;
  pagoSemanal: number | null = null;
  camposAval$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.mainForm = this.fb.group({
      cantidad: ['', [Validators.required, Validators.min(1000)]],
      plazos: ['', Validators.required],
      fechaInicial: ['', Validators.required],
      formCliente: this.fb.group({
        nombreCliente: ['', Validators.required],
        apellidoPaternoCliente: ['', Validators.required],
        apellidoMaternoCliente: ['', Validators.required],
        telefonoFijoCliente: ['', [Validators.required]],
        telefonoMovilCliente: ['', [Validators.required]],
        correoCliente: ['', [Validators.required, emailValidator()]],
        ocupacionCliente: [''],
        curpCliente: ['', [Validators.required, curpValidator()]],
        tipoCalleCliente: [null, Validators.required],
        nombreCalleCliente: ['', Validators.required],
        numeroExteriorCliente: [null, Validators.required],
        numeroInteriorCliente: [null],
        coloniaCliente: ['', Validators.required],
        municipioCliente: ['', Validators.required],
        estadoCliente: ['', Validators.required],
        codigoPostalCliente: [null, [Validators.required, lengthValidator(5)]],
        observacionesCliente: [''],
      }),
      formAval: this.fb.group({
        nombreAval: [''],
        apellidoPaternoAval: [''],
        apellidoMaternoAval: [''],
        telefonoFijoAval: [''],
        telefonoMovilAval: [''],
        emailAval: [''],
        ocupacionAval: [''],
        curpAval: [''],
        tipoCalleAval: [''],
        nombreCalleAval: [''],
        numeroExteriorAval: [''],
        numeroInteriorAval: [''],
        coloniaAval: [''],
        municipioAval: [''],
        estadoAval: [''],
        codigoPostalAval: [''],
        observacionesAval: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.camposAval$
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe((mostrarCamposAval) => {
        const formAval = this.mainForm.get('formAval')! as FormGroup;
        const nombreAval = formAval.get('nombreAval')!;
        const apellidoPaternoAval = formAval.get('apellidoPaternoAval')!;
        const apellidoMaternoAval = formAval.get('apellidoMaternoAval')!;
        const telefonoFijoAval = formAval.get('telefonoFijoAval')!;
        const telefonoMovilAval = formAval.get('telefonoMovilAval')!;
        const emailAval = formAval.get('emailAval')!;
        const curpAval = formAval.get('curpAval')!;
        const tipoCalleAval = formAval.get('tipoCalleAval')!;
        const nombreCalleAval = formAval.get('nombreCalleAval')!;
        const numeroExteriorAval = formAval.get('numeroExteriorAval')!;
        const coloniaAval = formAval.get('coloniaAval')!;
        const municipioAval = formAval.get('municipioAval')!;
        const estadoAval = formAval.get('estadoAval');
        const codigoPostalAval = formAval.get('codigoPostalAval')!;

        if (mostrarCamposAval) {
          nombreAval?.setValidators([Validators.required]);
          apellidoPaternoAval?.setValidators([Validators.required]);
          apellidoMaternoAval?.setValidators([Validators.required]);
          telefonoFijoAval?.setValidators([Validators.required]);
          telefonoMovilAval?.setValidators([Validators.required]);
          emailAval?.setValidators([Validators.required, emailValidator()]);
          curpAval?.setValidators([Validators.required, curpValidator()]);
          tipoCalleAval?.setValidators([Validators.required]);
          nombreCalleAval?.setValidators([Validators.required]);
          numeroExteriorAval?.setValidators([Validators.required]);
          coloniaAval?.setValidators([Validators.required]);
          municipioAval?.setValidators([Validators.required]);
          estadoAval?.setValidators([Validators.required]);
          codigoPostalAval?.setValidators([
            Validators.required,
            lengthValidator(5),
          ]);
        } else {
          nombreAval?.clearValidators();
          apellidoPaternoAval?.clearValidators();
          apellidoMaternoAval?.clearValidators();
          telefonoFijoAval?.clearValidators();
          telefonoMovilAval?.clearValidators();
          emailAval?.clearValidators();
          curpAval?.clearValidators();
          tipoCalleAval?.clearValidators();
          nombreCalleAval?.clearValidators();
          numeroExteriorAval?.clearValidators();
          coloniaAval?.clearValidators();
          municipioAval?.clearValidators();
          estadoAval?.clearValidators();
          codigoPostalAval?.clearValidators();
        }

        nombreAval?.updateValueAndValidity();
        apellidoPaternoAval?.updateValueAndValidity();
        apellidoMaternoAval?.updateValueAndValidity();
        telefonoFijoAval?.updateValueAndValidity();
        telefonoMovilAval?.updateValueAndValidity();
        emailAval?.updateValueAndValidity();
        curpAval?.updateValueAndValidity();
        tipoCalleAval?.updateValueAndValidity();
        nombreCalleAval?.updateValueAndValidity();
        numeroExteriorAval?.updateValueAndValidity();
        coloniaAval?.updateValueAndValidity();
        municipioAval?.updateValueAndValidity();
        estadoAval?.updateValueAndValidity();
        codigoPostalAval?.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.camposAval$.complete();
  }

  /**
   * Encargado de calcular prestamo cuando se cambia el plazo.
   *
   * @param {DropdownChangeEvent} event - El evento propio del componente de primeNg p-dropDown
   */
  onPlazoChanged({ value }: DropdownChangeEvent) {
    if (!value) return;
    this.semanasDePlazo = value.name;
    this.tasaDeInteres = value.value;
    this.calculaPrestamo();
    this.calculaFechaFinal();
  }

  /**
   * Encargado de calcular prestamo cuando se cambia la cantidad.
   *
   * @param {InputNumberInputEvent} event - El evento propio del componente de primeNg p-inputNumber
   */
  onInputCantidad({ value }: InputNumberInputEvent) {
    if (!value) return;
    this.cantidadIngresada = +value;
    if (this.cantidadIngresada < 1000) return;
    this.calculaPrestamo();
  }

  /**
   * Encargado de calcular el pago semanal y la cantidad total del prestamo.
   *
   */
  calculaPrestamo() {
    if (!this.cantidadIngresada || !this.tasaDeInteres) return;
    this.totalAPagar = +(
      this.cantidadIngresada *
      (1 + this.tasaDeInteres / 100)
    ).toFixed(2);
    const rawValue = this.totalAPagar / this.semanasDePlazo!;
    this.pagoSemanal = +rawValue.toFixed(2);
  }

  /**
   * Encargado de calcular el 'nombre' de la la semana y disparar el calculo de la funcion 'calcularFechaFinal'
   *
   * @param {Date} date - La fecha  de la cual se quiere saber el nombre de la semana que le corresponde.
   */
  calculaDiaDeLaSemana(date: Date) {
    this.fechaInicial = date;
    const dayIndex = this.fechaInicial.getDay();
    this.diaDeLaSemana = this.days[dayIndex];
    this.calculaFechaFinal();
  }

  /**
   * Encargado de calcular la fecha final con un formato facil de leer basado en el plazo y la fecha final definidas en la clase.
   *
   */
  calculaFechaFinal() {
    if (!this.fechaInicial || !this.semanasDePlazo) return;
    const result = new Date(this.fechaInicial);
    result.setDate(result.getDate() + this.semanasDePlazo! * 7);
    this.fechaFinal = result.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Determina si el elemento de HTML dentro de un FormControl debe ser mostrado o no para el atributo hidden del elemento.
   *
   * @param {string} nombreDelCampo - Nombre que tiene el campo dentro del formulario.
   */
  esCampoOculto(nombreDelCampo: string) {
    const control = this.mainForm.get(nombreDelCampo);
    if (!control) {
      console.warn(`Control ${control} no encontrado`);
      return false;
    }
    return control.valid || (!control.dirty && !control.touched);
  }

  onUpload(event: any) {
    const files = event.files;
    // TODO: generar el nombre del folder para el usuario
    const customerFolderName = 'jonathan';

    this.s3.uploadFiles(files, customerFolderName).subscribe({
      next: () => {
        this.ms.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Subida de archivos completada!',
          life: 3000,
        });
      },
      error: (err) => {
        console.log('ocurrio un error al subir archivos', err);
        this.ms.add({
          severity: 'error',
          summary: 'Rechazado',
          detail: `Ocurrio un problema al intentar subir los archivos: ${err?.status} ${err?.error.message}`,
          life: 3000,
        });
      },
      complete: () => {
        console.log('subida de archivos completada con exito');
      },
    });
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.ms.add({
        severity: 'error',
        summary: 'Rechazado',
        detail:
          'Algún dato es incorrecto o aun no se ha proporcionado, revisa nuevamente los campos en el formulario.',
        life: 5000,
      });
      //this.mainForm.markAllAsTouched();
      this.markFormGroupTouched(this.mainForm);
      return;
    }
    this.cs.confirm({
      message:
        'Valida que la información de este formulario es correcta y verídica. Estas seguro que deseas continuar con la solicitud?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Enviar solicitud',
      acceptIcon: 'none',
      rejectLabel: 'Regresar',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.onFormAccept(),
      reject: () => {
        console.error('error en construccion');
      },
      key: 'positionDialog',
    });
  }

  /**
   * Marca todos los controles anidados para el form proporcionado
   * @param formGroup - Form a marcar sus inputs como 'tocados'
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  onFormAccept() {
    // TODO: esperar a que el backend inserte la informacion,
    // si fue correcto entonces subir documentacion,
    // caso contrario no hacer nada pero informar al usuario con un toast
    this.triggerUpload();
  }

  /**
   *   Comprueba si hay archivos por subir, si los hay dispara el evento de subida a S3
   */
  triggerUpload() {
    if (this.fileUpload.hasFiles()) this.fileUpload.upload();
    else console.warn('no habia archivos por subir');
    console.log('triggerUpload');
  }

  /**
   * Activa o desactiva el formulario de Aval
   *
   * @param {InputSwitchChangeEvent} event - Evento propio del componente de primeNg p-inputSwitch
   */
  toggleFormAval(event: InputSwitchChangeEvent) {
    this.camposAval$.next(event.checked);
  }
}
