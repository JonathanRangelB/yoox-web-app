import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { InputNumberInputEvent } from 'primeng/inputnumber';
import { InputSwitch } from 'primeng/inputswitch';
import {
  catchError,
  debounceTime,
  EMPTY,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import {
  days,
  estadosDeLaRepublica,
  plazos,
  tiposCalle,
} from '../../utils/consts';
import {
  atLeastOneValidator,
  curpValidator,
  emailValidator,
  existingCurpAsyncValidator,
  existingPhonesAsyncValidator,
  lengthValidator,
} from '../../utils/customValidators';
import { S3BucketService } from '../../services/s3-bucket.service';
import { LoanRequestService } from '../../services/loan-request.service';
import {
  Address,
  dropDownCollection,
  IdsRecuperados,
  LoanRequest,
  Plazo,
  WindowMode,
} from '../../types/loan-request.interface';
import { ExistingCurpValidationService } from '../../services/validacion-curp.service';
import { ValidatorExistingPhoneService } from '../../services/validacion-telefonos.service';
import { InstallmentsService } from '../../services/installments.service';
import {
  getUserFromLocalStorage,
  removeEmptyValues,
} from 'src/app/shared/utils/functions.utils';
import { User } from 'src/app/shared/interfaces/userData.interface';
import { AddressService } from '../../services/adress.service';

@Component({
  selector: 'app-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css'],
  standalone: false,
})
export class LoanComponent implements OnDestroy, OnInit {
  fileUpload = viewChild<FileUpload>('fileUpload');
  switchBusqueda = viewChild<InputSwitch>('switchBusqueda');
  dialogMessage = viewChild<Dialog>('dialogMessage');
  readonly #formBuilder = inject(FormBuilder);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #messageService = inject(MessageService);
  readonly #s3BucketService = inject(S3BucketService);
  readonly #loanRequestService = inject(LoanRequestService);
  readonly #validatorCurpService = inject(ExistingCurpValidationService);
  readonly #validatorPhonesService = inject(ValidatorExistingPhoneService);
  readonly #installmentsService = inject(InstallmentsService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #addressService = inject(AddressService);
  windowMode: WindowMode = 'new';
  windowModeParams!: Params;
  loanRequestId?: string;
  id?: number;
  destroy$ = new Subject();
  customerSearchVisible = false;
  customerFolderName?: string;
  position: string = 'bottom';
  mainForm: FormGroup;
  tiposCalle: dropDownCollection[] = tiposCalle;
  estadosDeLaRepublica: dropDownCollection[] = estadosDeLaRepublica;
  plazo?: Plazo[];
  semanasDePlazo: number | undefined;
  id_plazo: number | undefined;
  semana_refinanciamiento: string | undefined = '';
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
  id_cliente_recuperado = 0;
  id_aval_recuperado = 0;
  showLoadingModal = false;
  viewLoan: any;
  observationsHistory = '';
  status = '';
  rolUsuario = 'Cobrador';
  statusProvisional = '';
  createdBy?: number;
  createdDate?: Date;
  closedBy?: number;
  modifiedDate?: Date;
  modifiedBy?: number;
  closedDate?: Date;
  currentUser!: User | null;
  timeoutRef?: NodeJS.Timeout;
  id_agente?: number;
  id_loan?: number;
  nombre_agente?: string;
  modified_by_name?: string;
  closed_by_name?: string;
  id_grupo_original?: number;
  idDomicilioSearch$: Subject<{ id: number; formName: string }> = new Subject();

  constructor() {
    this.mainForm = this.formInit();
    this.addressSearchSubjectInit();
  }

  ngOnInit(): void {
    this.currentUser = getUserFromLocalStorage();
    this.#activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe((url) => {
      this.windowMode = url[0].path as WindowMode;
    });

    this.#activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.windowModeParams = params;
        this.loanRequestId = this.windowModeParams['loanId'];
      });

    this.#installmentsService
      .getInstallments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.plazo = data;
        },
        error: (error) => {
          console.log(error);
        },
      });

    if (this.windowMode === 'view') {
      this.showLoadingModal = true;
      this.clearAsyncValidators();
      this.fillFormForViewMode();
    }
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.timeoutRef);
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  formInit() {
    return this.#formBuilder.group({
      cantidad_prestada: ['', [Validators.required, Validators.min(1000)]],
      plazo: ['', Validators.required],
      fecha_inicial: ['', Validators.required],
      observaciones: [''],
      formCliente: this.#formBuilder.group(
        {
          nombre_cliente: ['', Validators.required],
          apellido_paterno_cliente: ['', Validators.required],
          apellido_materno_cliente: ['', Validators.required],
          telefono_fijo_cliente: [
            '',
            {
              asyncValidators: existingPhonesAsyncValidator(
                this.#validatorPhonesService,
                'CLIENTES',
                'telefono_fijo'
              ),
              updateOn: 'blur',
            },
          ],
          telefono_movil_cliente: [
            '',
            {
              asyncValidators: existingPhonesAsyncValidator(
                this.#validatorPhonesService,
                'CLIENTES',
                'telefono_movil'
              ),
              updateOn: 'blur',
            },
          ],
          correo_electronico_cliente: ['', emailValidator()],
          ocupacion_cliente: [''],
          curp_cliente: [
            '',
            {
              validators: [Validators.required, curpValidator()],
              asyncValidators: existingCurpAsyncValidator(
                this.#validatorCurpService,
                'CLIENTES'
              ),
              updateOn: 'blur',
            },
          ],
          id_domicilio_cliente: [],
          tipo_calle_cliente: ['', Validators.required],
          nombre_calle_cliente: ['', Validators.required],
          numero_exterior_cliente: [null, Validators.required],
          numero_interior_cliente: [''],
          colonia_cliente: ['', Validators.required],
          municipio_cliente: ['', Validators.required],
          estado_cliente: ['', Validators.required],
          cp_cliente: ['', [Validators.required, lengthValidator(5)]],
          referencias_dom_cliente: [''],
        },
        {
          validators: [
            atLeastOneValidator([
              'telefono_fijo_cliente',
              'telefono_movil_cliente',
            ]),
          ],
        }
      ),
      formAval: this.#formBuilder.group(
        {
          nombre_aval: ['', Validators.required],
          apellido_paterno_aval: ['', Validators.required],
          apellido_materno_aval: ['', Validators.required],
          telefono_fijo_aval: [
            '',
            {
              asyncValidators: existingPhonesAsyncValidator(
                this.#validatorPhonesService,
                'AVALES',
                'telefono_fijo'
              ),
              updateOn: 'blur',
            },
          ],
          telefono_movil_aval: [
            '',
            {
              asyncValidators: existingPhonesAsyncValidator(
                this.#validatorPhonesService,
                'AVALES',
                'telefono_movil'
              ),
              updateOn: 'blur',
            },
          ],
          correo_electronico_aval: ['', emailValidator()],
          curp_aval: [
            '',
            {
              validators: [Validators.required, curpValidator()],
              asyncValidators: existingCurpAsyncValidator(
                this.#validatorCurpService,
                'AVALES'
              ),
              updateOn: 'blur',
            },
          ],
          id_domicilio_aval: [],
          tipo_calle_aval: ['', Validators.required],
          nombre_calle_aval: ['', Validators.required],
          numero_exterior_aval: ['', Validators.required],
          numero_interior_aval: [''],
          colonia_aval: ['', Validators.required],
          municipio_aval: ['', Validators.required],
          estado_aval: ['', Validators.required],
          cp_aval: ['', [Validators.required, lengthValidator(5)]],
          referencias_dom_aval: [''],
        },
        {
          validators: [
            atLeastOneValidator(['telefono_fijo_aval', 'telefono_movil_aval']),
          ],
        }
      ),
    });
  }

  /**
   * Encargado de calcular prestamo cuando se cambia el plazo.
   *
   * @param {DropdownChangeEvent} event - El evento propio del componente de primeNg p-dropDown
   */
  onPlazoChanged({ value }: DropdownChangeEvent) {
    if (!value) return;
    this.semanasDePlazo = +value.semanas_plazo;
    this.tasa_interes = value.tasa_de_interes;
    this.id_plazo = value.id;
    this.semana_refinanciamiento = value.semanas_refinancia;
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
   * @param {string} fieldName - Nombre que tiene el campo dentro del formulario.
   */
  hideField(fieldName: string) {
    const control = this.mainForm.get(fieldName);
    if (!control) {
      console.warn(`Control ${control} not found`);
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
      .pipe(takeUntil(this.destroy$))
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

    if (
      !this.statusProvisional &&
      this.currentUser?.ROL !== 'Cobrador' &&
      this.windowMode === 'view'
    ) {
      this.#messageService.add({
        severity: 'error',
        summary: 'Sin status',
        detail:
          'Aun no se ha seleccionado un status nuevo para la solicitud, por favor selecciona uno antes de continuar.',
        life: 5000,
      });
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
    const loanMode = this.windowMode === 'new' ? 'new' : 'update';
    this.#loanRequestService
      .registerLoan(requestData, loanMode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: { customerFolderName: string }) => {
          this.customerFolderName = data.customerFolderName
            ? data.customerFolderName.toUpperCase()
            : this.customerFolderName;
          this.triggerUpload();
          this.#messageService.add({
            severity: 'success',
            summary:
              this.windowMode === 'new'
                ? 'Cambios realizados'
                : 'La solicitud fue creada.\n\nRedirigiendo a listado',
            detail:
              this.windowMode === 'view'
                ? `Los datos han sido actualizados correctamente con status ${this.statusProvisional || this.status}`
                : 'La solicitud esta en espera a ser aprobada.\n\nRedirigiendo a listado.',
            life: 5000,
          });
          this.uploadSuccessfull = true;
          this.uploading = false;
          this.timeoutRef = setTimeout(
            () => this.#router.navigate(['/dashboard/request-list']),
            5000
          );
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
    const additionalData = this.injectCommonData();
    // la siguiente variable es la que relamente se manda al backend
    // incluye toda la informacion del formulario, datos calculados y datos de sesion
    requestData = {
      ...this.mainForm.value,
      formCliente: {
        ...this.mainForm.value.formCliente,
        ...(this.id_cliente_recuperado
          ? { id_cliente: this.id_cliente_recuperado }
          : {}),
      },
      formAval: {
        ...this.mainForm.value.formAval,
        ...(this.id_aval_recuperado
          ? { id_aval: this.id_aval_recuperado }
          : {}),
      },
      ...additionalData,
    };
    this.observationsHistory = this.generateHistoricObservationField();
    let newStatus = this.statusProvisional
      ? this.statusProvisional
      : this.status;
    if (this.windowMode === 'view') {
      if (this.currentUser?.ROL === 'Cobrador')
        newStatus = newStatus === 'ACTUALIZAR' ? 'EN REVISION' : newStatus;
      else {
        newStatus = newStatus === 'EN REVISION' ? 'ACTUALIZAR' : newStatus;
      }
    }
    requestData = {
      ...requestData,
      loan_request_status: newStatus,
      id: this.id,
      request_number: this.loanRequestId,
      modified_by: this.currentUser?.ID,
      user_role: this.currentUser?.ROL,
      observaciones: this.observationsHistory.trim(),
    };
    return removeEmptyValues(requestData);
  }

  /**
   * Encardada de construir la informacion adicional para ser inyectada a los datos del formulario.
   * Necesario dado a que el formulario solo tiene acceso a sus inputs en el template,
   * el resto de la información es calculada en diferentes partes del componente.
   *
   * @throws {Error} - Arroja un error si no encuentra la informacion en localStorage, la cual fue generada en el componente `login`
   * @returns {any} - El objeto con la informacion adicional para ser enviado al backend junto con los datos del formulario.
   */
  injectCommonData(): any {
    if (!this.currentUser)
      throw new Error(
        'No se encontraron los datos del usuario en localStorage'
      );
    return {
      // NOTE: si existe el id_agente significa que se recupero el dato, osea que es un update, caso contrario es un newLoanRequest
      id_agente: this.id_agente || this.currentUser.ID,
      created_by: this.createdBy || this.currentUser.ID,
      user_role: this.currentUser.ROL,
      id_grupo_original: this.id_grupo_original || this.currentUser.ID_GRUPO,
      fecha_final_estimada: this.fecha_final_estimada,
      dia_semana: this.dia_semana,
      cantidad_pagar: this.cantidad_pagar,
    };
  }

  /** Comprueba si hay archivos por subir, si los hay dispara el evento de subida a S3 */
  triggerUpload() {
    if (this.fileUpload()?.hasFiles()) this.fileUpload()?.upload();
    else console.log('no habia archivos por subir');
  }

  /** Activa y desactiva el componente de busqueda de clientes y actualiza el estado del inputswitch  */
  toggleCustomerSearch() {
    this.customerSearchVisible = !this.customerSearchVisible;
    this.switchBusqueda()?.writeValue(this.customerSearchVisible);
    if (this.id_cliente_recuperado) {
      this.clearAsyncValidators();
    } else {
      this.mainForm
        .get('formCliente.curp_cliente')
        ?.setAsyncValidators(
          existingCurpAsyncValidator(this.#validatorCurpService, 'CLIENTES')
        );
      this.mainForm
        .get('formAval.curp_aval')
        ?.setAsyncValidators(
          existingCurpAsyncValidator(this.#validatorCurpService, 'AVALES')
        );

      this.mainForm.updateValueAndValidity();
    }
  }

  /**
   * guarda los valores de id_cliente e id_aval los cuales son recuperados/emitidos del componente de busqueda
   *
   * @param idsRecuperados - Los Id's recuperados de emitidos por el componente de busqueda
   */
  updateCustomerFoundId(idsRecuperados: IdsRecuperados) {
    this.id_cliente_recuperado = idsRecuperados.id_cliente;
    this.id_aval_recuperado = idsRecuperados.id_aval;
    this.mainForm.patchValue({
      formCliente: {
        id_domicilio_cliente: idsRecuperados.id_domicilio_cliente,
      },
      formAval: {
        id_domicilio_aval: idsRecuperados.id_domicilio_aval,
      },
    });
  }

  /** Encargada de eliminar los validadores asincronos cuando no se necesitan, solo son requedidos en modo new, en los demas modos no se necesitan */
  clearAsyncValidators() {
    const form_curp_cliente = this.mainForm.get('formCliente.curp_cliente');
    const form_curp_aval = this.mainForm.get('formAval.curp_aval');
    const form_telefono_movil_cliente = this.mainForm.get(
      'formCliente.telefono_movil_cliente'
    );
    const form_telefono_fijo_cliente = this.mainForm.get(
      'formCliente.telefono_fijo_cliente'
    );
    const form_telefono_movil_aval = this.mainForm.get(
      'formAval.telefono_movil_aval'
    );
    const form_telefono_fijo_aval = this.mainForm.get(
      'formAval.telefono_fijo_aval'
    );
    form_curp_cliente?.clearAsyncValidators();
    form_curp_cliente?.updateValueAndValidity();
    form_curp_aval?.clearAsyncValidators();
    form_curp_aval?.updateValueAndValidity();
    form_telefono_movil_cliente?.clearAsyncValidators();
    form_telefono_movil_cliente?.updateValueAndValidity();
    form_telefono_fijo_cliente?.clearAsyncValidators();
    form_telefono_fijo_cliente?.updateValueAndValidity();
    form_telefono_movil_aval?.clearAsyncValidators();
    form_telefono_movil_aval?.updateValueAndValidity();
    form_telefono_fijo_aval?.clearAsyncValidators();
    form_telefono_fijo_aval?.updateValueAndValidity();
  }

  /**
   * @returns string formateado el cual agrega al final el ultimo texto en el campo de observaciones
   */
  generateHistoricObservationField() {
    const campoObservaciones = this.mainForm.get('observaciones');
    if (!campoObservaciones?.value) {
      return this.observationsHistory;
    }
    const date = new Date().toLocaleString('es-MX');
    const currentUser = localStorage.getItem('user');
    const nombreUsuario = JSON.parse(currentUser!).NOMBRE;
    return (
      this.observationsHistory +
      `\n\n${nombreUsuario} - ${date}:\n${campoObservaciones?.value}`
    );
  }

  /** Encargada se setear todo lo necesario para que el modo "view" funcione correctamente */
  fillFormForViewMode() {
    this.viewLoan = this.#loanRequestService
      .viewLoan({ request_number: this.windowModeParams['loanId'] })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: LoanRequest) => {
          this.showLoadingModal = false;
          this.status = data.loan_request_status;
          this.id = data.id;
          this.id_loan = data.id_loan;
          this.id_agente = data.id_agente;
          this.createdBy = data.created_by;
          this.createdDate = data.created_date;
          this.modifiedBy = data.modified_by;
          this.modifiedDate = data.modified_date;
          this.closedBy = data.closed_by!;
          this.closedDate = data.closed_date!;
          this.tasa_interes = data.tasa_de_interes;
          this.cantidadIngresada = data.cantidad_prestada;
          this.fecha_inicial = new Date(data.fecha_inicial.replace(/Z$/, ''));
          this.fechaMinima = this.fecha_inicial;
          this.customerFolderName = `${this.loanRequestId}-${data.apellido_paterno_cliente.toUpperCase()}`;
          this.nombre_agente = data.nombre_agente;
          this.modified_by_name = data.modified_by_name;
          this.closed_by_name = data.closed_by_name;
          this.id_grupo_original = data.id_grupo_original;
          this.semanasDePlazo = +plazos.find(
            (plazo) => plazo.id === data.id_plazo
          )!.semanas_plazo;
          this.cantidad_pagar = +(
            this.cantidadIngresada *
            (1 + this.tasa_interes / 100)
          ).toFixed(2);
          this.pagoSemanal =
            this.cantidad_pagar /
            Number(
              plazos.find((plazo) => plazo.id === data.id_plazo)!.semanas_plazo
            );
          this.semana_refinanciamiento = plazos.find(
            (plazo) => plazo.id === data.id_plazo
          )?.semanas_refinancia;
          this.observationsHistory = data.observaciones;
          this.mainForm.patchValue({
            cantidad_prestada: data.cantidad_prestada,
            plazo: plazos.find((plazo) => plazo.id === data.id_plazo),
            fecha_inicial: this.fecha_inicial, // la fecha debe ser string mm-dd-yyyy
            // observaciones: data.observaciones,
            formCliente: {
              nombre_cliente: data.nombre_cliente,
              apellido_paterno_cliente: data.apellido_paterno_cliente,
              apellido_materno_cliente: data.apellido_materno_cliente,
              telefono_fijo_cliente: data.telefono_fijo_cliente,
              telefono_movil_cliente: data.telefono_movil_cliente,
              correo_electronico_cliente: data.correo_electronico_cliente,
              ocupacion_cliente: data.ocupacion_cliente,
              curp_cliente: data.curp_cliente,
              id_domicilio_cliente: data.id_domicilio_cliente,
              tipo_calle_cliente: tiposCalle.find(
                (tipo) => tipo.value === data.tipo_calle_cliente
              ),
              nombre_calle_cliente: data.nombre_calle_cliente,
              numero_exterior_cliente: data.numero_exterior_cliente,
              numero_interior_cliente: data.numero_interior_cliente,
              colonia_cliente: data.colonia_cliente,
              municipio_cliente: data.municipio_cliente,
              estado_cliente: estadosDeLaRepublica.find(
                (estado) => estado.value === data.estado_cliente
              ),
              cp_cliente: data.cp_cliente,
              referencias_dom_cliente: data.referencias_dom_cliente,
            },
            formAval: {
              nombre_aval: data.nombre_aval,
              apellido_paterno_aval: data.apellido_paterno_aval,
              apellido_materno_aval: data.apellido_materno_aval,
              telefono_fijo_aval: data.telefono_fijo_aval,
              telefono_movil_aval: data.telefono_movil_aval,
              correo_electronico_aval: data.correo_electronico_aval,
              curp_aval: data.curp_aval,
              id_domicilio_aval: data.id_domicilio_aval,
              tipo_calle_aval: tiposCalle.find(
                (tipo) => tipo.value === data.tipo_calle_aval
              ),
              nombre_calle_aval: data.nombre_calle_aval,
              numero_exterior_aval: data.numero_exterior_aval,
              numero_interior_aval: data.numero_interior_aval,
              colonia_aval: data.colonia_aval,
              municipio_aval: data.municipio_aval,
              estado_aval: estadosDeLaRepublica.find(
                (estado) => estado.value === data.estado_cliente
              ),
              cp_aval: data.cp_aval,
              referencias_dom_aval: data.referencias_dom_aval,
            },
          });
          this.calculaFechaFinal();
          this.calculaDiaDeLaSemana(
            new Date(data.fecha_inicial.replace(/Z$/, ''))
          );
          this.mainForm.updateValueAndValidity();
          this.#messageService.add({
            severity: 'success',
            detail: 'Registro encontrado!',
            life: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.#messageService.add({
            severity: 'error',
            detail:
              'Registro inexistente o no asignado a su usuario, seras reedirigido al listado de solicitudes en 5 segundos',
            summary: error.error?.error,
            life: 5000,
          });
          setTimeout(() => {
            this.#router.navigate(['dashboard/request-list']);
          }, 5000);
        },
      });
  }

  updateProvitionalStatus(
    newStatus: 'ACTUALIZAR' | 'APROBADO' | 'EN REVISION' | 'RECHAZADO'
  ) {
    this.statusProvisional = newStatus;
  }

  shouldHideSendButton() {
    if (this.windowMode === 'view') {
      if (this.status === 'APROBADO' || this.status === 'RECHAZADO')
        return true;
      if (this.currentUser?.ROL === 'Cobrador')
        if (this.status !== 'ACTUALIZAR') return true;
    }
    return false; // windowMode !== 'new'
  }

  searchAddressByID(event: InputNumberInputEvent, formName: string) {
    if (!event.value) return;
    this.idDomicilioSearch$.next({ id: +event.value, formName });
  }

  addressSearchSubjectInit() {
    this.idDomicilioSearch$
      .pipe(
        debounceTime(1500),
        switchMap((addressRequestData) =>
          this.#addressService.getAddress(addressRequestData.id).pipe(
            map((foundAddressData) => ({
              addressData: foundAddressData,
              formName: addressRequestData.formName,
            })),
            catchError((error) => {
              this.#messageService.add({
                severity: 'error',
                summary: error.error,
                detail: `${error.error.error || error.message}`,
                life: 5000,
              });
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: ({ addressData, formName }) => {
          this.fillAddressDataIntoForm(addressData, formName);
          this.#messageService.add({
            severity: 'success',
            summary: 'Exito',
            detail: 'Direccion encontrada',
            life: 5000,
          });
        },
      });
  }

  fillAddressDataIntoForm(address: Address, formName: string) {
    console.log({ address, formName });
    switch (formName) {
      case 'formCliente':
        console.log('formCliente');
        this.mainForm.get(formName)?.patchValue({
          tipo_calle_cliente: tiposCalle.find(
            (tipo) => tipo.value === address.tipo_calle
          ),
          nombre_calle_cliente: address.nombre_calle,
          numero_exterior_cliente: address.numero_exterior,
          numero_interior_cliente: address.numero_interior,
          colonia_cliente: address.colonia,
          municipio_cliente: address.municipio,
          estado_cliente: estadosDeLaRepublica.find(
            (estado) => estado.value === address.estado
          ),
          cp_cliente: address.cp,
          referencias_dom_cliente: address.referencias,
        });
        break;
      case 'formAval':
        console.log('formAval');
        this.mainForm.get(formName)?.patchValue({
          tipo_calle_aval: tiposCalle.find(
            (tipo) => tipo.value === address.tipo_calle
          ),
          nombre_calle_aval: address.nombre_calle,
          numero_exterior_aval: address.numero_exterior,
          numero_interior_aval: address.numero_interior,
          colonia_aval: address.colonia,
          municipio_aval: address.municipio,
          estado_aval: estadosDeLaRepublica.find(
            (estado) => estado.value === address.estado
          ),
          cp_aval: address.cp,
          referencias_dom_aval: address.referencias,
        });
        break;
    }
  }
}
