/* eslint-disable no-useless-escape */
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { LoanRequestService } from '../../services/loan-request.service';
import { AuthService } from 'src/app/login/services/AuthService';

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
  camposAval$ = new BehaviorSubject<boolean>(false);
  customerFolderName?: string;
  authService = inject(AuthService);
  loanRequestService = inject(LoanRequestService);
  position: string = 'bottom';
  mainForm: FormGroup;
  tiposCalle: dropDownCollection[] = tiposCalle;
  estadosDeLaRepublica: dropDownCollection[] = estadosDeLaRepublica;
  plazo: dropDownCollection[] = plazos;
  semanasDePlazo: number | undefined;
  id_plazo: number | undefined;
  fecha_inicial: Date | undefined;
  fecha_final_estimada: Date | undefined;
  fecha_final_estimada_string: string | null = null;
  fechaMinima: Date = new Date();
  dia_semana: string | null = null;
  days: string[] = days;
  cantidadIngresada: number = 0;
  tasa_interes: number = 0;
  cantidad_pagar: number = 0;
  pagoSemanal: number | null = null;

  constructor() {
    this.mainForm = this.fb.group({
      cantidad_prestada: ['', [Validators.required, Validators.min(1000)]],
      plazo: ['', Validators.required],
      fecha_inicial: ['', Validators.required],
      formCliente: this.fb.group({
        nombre_cliente: ['', Validators.required],
        apellido_paterno_cliente: ['', Validators.required],
        apellido_materno_cliente: ['', Validators.required],
        telefono_fijo_cliente: ['', [Validators.required]],
        telefono_movil_cliente: ['', [Validators.required]],
        correo_electronico_cliente: [
          '',
          [Validators.required, emailValidator()],
        ],
        ocupacion_cliente: [''],
        curp_cliente: ['', [Validators.required, curpValidator()]],
        tipo_calle_cliente: ['', Validators.required],
        nombre_calle_cliente: ['', Validators.required],
        numero_exterior_cliente: [null, Validators.required],
        numero_interior_cliente: [''],
        colonia_cliente: ['', Validators.required],
        municipio_cliente: ['', Validators.required],
        estado_cliente: ['', Validators.required],
        cp_cliente: ['', [Validators.required, lengthValidator(5)]],
        observaciones_cliente: [''],
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
    this.tasa_interes = value.value;
    this.id_plazo = value.id;
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
    if (!this.cantidadIngresada || !this.tasa_interes) return;
    this.cantidad_pagar = +(
      this.cantidadIngresada *
      (1 + this.tasa_interes / 100)
    ).toFixed(2);
    const rawValue = this.cantidad_pagar / this.semanasDePlazo!;
    this.pagoSemanal = +rawValue.toFixed(2);
  }

  /**
   * Encargado de calcular el 'nombre' de la la semana y disparar el calculo de la funcion 'calcularFechaFinal'
   *
   * @param {Date} date - La fecha  de la cual se quiere saber el nombre de la semana que le corresponde.
   */
  calculaDiaDeLaSemana(date: Date) {
    this.fecha_inicial = date;
    const dayIndex = this.fecha_inicial.getDay();
    this.dia_semana = this.days[dayIndex];
    this.calculaFechaFinal();
  }

  /**
   * Encargado de calcular la fecha final con un formato facil de leer basado en el plazo y la fecha final definidas en la clase.
   *
   */
  calculaFechaFinal() {
    if (!this.fecha_inicial || !this.semanasDePlazo) return;
    const result = new Date(this.fecha_inicial);
    result.setDate(result.getDate() + this.semanasDePlazo! * 7);
    this.fecha_final_estimada = result;
    this.fecha_final_estimada_string = result.toLocaleDateString('es-MX', {
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
    if (!this.customerFolderName)
      throw new Error(
        'No se pudo obtener el nombre del directorio para el cliente'
      );

    this.s3.uploadFiles(files, this.customerFolderName).subscribe({
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
    const requestData = this.buildRequestData();
    this.loanRequestService
      .registerNewLoan(requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: { customerFolderName: string }) => {
          this.customerFolderName = data.customerFolderName;
          console.log(data);
          this.triggerUpload();
        },
        error: (error: any) => {
          console.log(error);
          this.ms.add({
            severity: 'error',
            summary: `${error.name}`,
            detail: `${error.error.error || error.message}`,
            life: 5000,
          });
        },
      });
  }

  /**
   * Crea el objeto para hacer la peticion al backend.
   *
   * @returns {any} - El objeto final a enviar al endpoint de creaciond de nuevas solicitudes.
   */
  buildRequestData(): any {
    let requestData = {};
    const user = this.authService.currentUser;
    console.log('usuario encontrado: ' + user);
    if (user) {
      requestData = {
        ...this.mainForm.value,
        id_agente: user.ID,
        created_by: user.ID,
        id_grupo_original: +user.ID_GRUPO!,
        fecha_final_estimada: this.fecha_final_estimada,
        dia_semana: this.dia_semana,
        cantidad_pagar: this.cantidad_pagar,
      };
    }
    console.log({ requestData });
    return requestData;
  }

  /**
   *   Comprueba si hay archivos por subir, si los hay dispara el evento de subida a S3
   */
  triggerUpload() {
    if (this.fileUpload.hasFiles()) this.fileUpload.upload();
    else console.warn('no habia archivos por subir');
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
