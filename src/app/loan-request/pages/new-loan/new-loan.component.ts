/* eslint-disable no-useless-escape */
import { Component, inject, OnDestroy, viewChild } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { LoanRequestService } from '../../services/loan-request.service';
import {
  CurrentUser,
  dropDownCollection,
} from '../../types/loan-request.interface';
import { InputSwitch } from 'primeng/inputswitch';

@Component({
  selector: 'app-new-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css'],
})
export class NewLoanComponent implements OnDestroy {
  fileUpload = viewChild<FileUpload>('fileUpload');
  switchBusqueda = viewChild<InputSwitch>('switchBusqueda');
  readonly #formBuilder = inject(FormBuilder);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #messageService = inject(MessageService);
  readonly #s3BucketService = inject(S3BucketService);
  readonly #loanRequestService = inject(LoanRequestService);
  destroy$ = new Subject();
  customerSearchVisible = false;
  customerFolderName?: string;
  position: string = 'bottom';
  mainForm: FormGroup;
  customerSearchForm: FormGroup;
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
  uploading = false;
  uploadSuccessfull = false;

  constructor() {
    this.mainForm = this.#formBuilder.group({
      cantidad_prestada: ['', [Validators.required, Validators.min(1000)]],
      plazo: ['', Validators.required],
      fecha_inicial: ['', Validators.required],
      observaciones: [''],
      formCliente: this.#formBuilder.group({
        nombre_cliente: ['', Validators.required],
        apellido_paterno_cliente: ['', Validators.required],
        apellido_materno_cliente: ['', Validators.required],
        telefono_fijo_cliente: ['', [Validators.required]],
        telefono_movil_cliente: ['', [Validators.required]],
        correo_electronico_cliente: ['', emailValidator()],
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
        referencias_dom_cliente: [''],
      }),
      formAval: this.#formBuilder.group({
        nombre_aval: ['', Validators.required],
        apellido_paterno_aval: ['', Validators.required],
        apellido_materno_aval: ['', Validators.required],
        telefono_fijo_aval: ['', Validators.required],
        telefono_movil_aval: ['', Validators.required],
        correo_electronico_aval: ['', emailValidator()],
        ocupacion_aval: [''],
        curp_aval: ['', [Validators.required, curpValidator()]],
        tipo_calle_aval: ['', Validators.required],
        nombre_calle_aval: ['', Validators.required],
        numero_exterior_aval: ['', Validators.required],
        numero_interior_aval: [''],
        colonia_aval: ['', Validators.required],
        municipio_aval: ['', Validators.required],
        estado_aval: ['', Validators.required],
        cp_aval: ['', [Validators.required, lengthValidator(5)]],
        referencias_dom_aval: [''],
      }),
    });

    this.customerSearchForm = this.#formBuilder.group({
      id: [''],
      curp: ['', curpValidator()],
      nombre: [''],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
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

  /**
   * Metodo personalizado a usar por el componente fileUpload de PrimeNg.
   * este metodo de dispara cuando dicho componente dispara la funcionalidad de subir los archivos.
   * Necesita ser disparado manualmente mandando llamar la funcion `fileUpload.hasFiles()`,
   * solo hasta ese momento esta funcion debera de ser llamada por ese otro componente.
   *
   * @param {FileUploadEvent} event - Evento del componente fileUpload de PrimeNg
   * @throws {Error} - Arroja un error al no poder obtener el nombre del folder para ser creado en S3.
   */
  onUpload(event: FileUploadHandlerEvent) {
    const files = event.files;
    if (!this.customerFolderName)
      throw new Error(
        'No se pudo obtener el nombre del directorio para el cliente'
      );

    this.#s3BucketService
      .uploadFiles(files, this.customerFolderName)
      .subscribe({
        next: () => {
          this.#messageService.add({
            severity: 'info',
            summary: 'Confirmado',
            detail: 'Subida de archivos completada!',
            life: 3000,
          });
        },
        error: (err) => {
          this.#messageService.add({
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

  /**
   * Metodo que verifica la validez de todos los campos dentro del formulario.
   * No deja avanzar al usuario en dado caso que tenga algun dato incorrecto o faltante.
   *
   */
  onSubmit() {
    if (!this.mainForm.valid) {
      this.#messageService.add({
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
    this.#confirmationService.confirm({
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

  /**
   * Encardada de hacer formalmente la peticion al backend.
   * llama internamente a la creacion del objeto final a enviar.
   * muestra un mensaje toast tipo success al hacer todo el proceso correctamente.
   * muestra un mensaje toast tipo error cuando algun proceso del front o del backend falla.
   *
   */
  onFormAccept() {
    this.uploading = true;
    const requestData = this.buildRequestData();
    this.#loanRequestService
      .registerNewLoan(requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: { customerFolderName: string }) => {
          this.customerFolderName = data.customerFolderName;
          this.triggerUpload();
          this.#messageService.add({
            severity: 'success',
            summary: 'La solicitud fue creada',
            detail: 'La solicitud esta en espera a ser aprobada',
            life: 5000,
          });
          this.uploadSuccessfull = true;
          this.uploading = false;
        },
        error: (error: any) => {
          this.uploading = false;
          this.#messageService.add({
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
   * combina el contenido del formulario con valores calculados y del usuario actualmente autenticado.
   *
   * @returns {any} - El objeto final a enviar al endpoint de creaciond de nuevas solicitudes.
   */
  buildRequestData(): any {
    let requestData = {};
    const additionalData = this.generateAdditionalData();
    if (additionalData) {
      requestData = {
        ...this.mainForm.value,
        ...additionalData,
      };
    }
    return requestData;
  }

  /**
   * Encardada de construir la informacion adicional para ser inyectada a los datos del formulario.
   * Necesario dado a que el formulario solo tiene acceso a sus inputs en el template,
   * el resto de la información es calculada en diferentes partes del componente.
   *
   * @throws {Error} - Arroja un error si no encuentra la informacion en localStorage, la cual fue generada en el componente `login`
   * @returns {any} - El objeto con la informacion adicional para ser enviado al backend junto con los datos del formulario.
   */
  generateAdditionalData(): any {
    const user = localStorage.getItem('user');
    if (!user)
      throw new Error(
        'No se encontraron los datos del usuario en localStorage'
      );
    const { ID, ID_GRUPO } = JSON.parse(user) as CurrentUser;
    return {
      id_agente: ID,
      created_by: ID,
      id_grupo_original: ID_GRUPO,
      fecha_final_estimada: this.fecha_final_estimada,
      dia_semana: this.dia_semana,
      cantidad_pagar: this.cantidad_pagar,
    };
  }

  /** Comprueba si hay archivos por subir, si los hay dispara el evento de subida a S3 */
  triggerUpload() {
    if (this.fileUpload()?.hasFiles()) this.fileUpload()?.upload();
    else console.warn('no habia archivos por subir');
  }

  /** Activa y desactiva el componente de busqueda de clientes y actualiza el estado del inputswitch  */
  toggleCustomerSearch() {
    this.customerSearchVisible = !this.customerSearchVisible;
    this.switchBusqueda()?.writeValue(this.customerSearchVisible);
  }
}
