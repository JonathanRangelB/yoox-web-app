/* eslint-disable no-useless-escape */
import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
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
  atLeastOneValidator,
  curpValidator,
  emailValidator,
  existingCurpAsyncValidator,
  existingPhonesAsyncValidator,
  lengthValidator,
} from '../../utils/customValidators';
import { S3BucketService } from '../../services/s3-bucket.service';
import { Subject, takeUntil } from 'rxjs';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { LoanRequestService } from '../../services/loan-request.service';
import {
  CurrentUser,
  dropDownCollection,
  IdsRecuperados,
  LoanRequest,
  Plazo,
} from '../../types/loan-request.interface';
import { InputSwitch } from 'primeng/inputswitch';
import { ExistingCurpValidationService } from '../../services/validacion-curp.service';
import { ValidatorExistingPhoneService } from '../../services/validacion-telefonos.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-loan',
  templateUrl: './new-loan.component.html',
  styleUrls: ['./new-loan.component.css'],
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
  readonly route = inject(ActivatedRoute);
  windowMode: string = 'new';
  windowModeParams!: Params;
  loanId?: string;
  destroy$ = new Subject();
  customerSearchVisible = false;
  customerFolderName?: string;
  position: string = 'bottom';
  mainForm: FormGroup;
  customerSearchForm: FormGroup;
  tiposCalle: dropDownCollection[] = tiposCalle;
  estadosDeLaRepublica: dropDownCollection[] = estadosDeLaRepublica;
  plazo: Plazo[] = plazos;
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

  constructor() {
    this.mainForm = this.#formBuilder.group({
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

    this.customerSearchForm = this.#formBuilder.group({
      id: [''],
      curp: ['', curpValidator()],
      nombre: [''],
    });
  }

  ngOnInit(): void {
    this.route.url.pipe(takeUntil(this.destroy$)).subscribe((url) => {
      this.windowMode = url[0].path;
      if (this.windowMode === 'view') {
        this.showLoadingModal = true;
        this.clearAsyncValidators();
      }
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.windowModeParams = params;
      this.loanId = this.windowModeParams['loanId'];
    });
    // console.table({
    //   mode: this.windowMode,
    //   params: this.windowModeParams['loanId'],
    // });

    if (this.windowMode === 'view')
      this.viewLoan = this.#loanRequestService
        .viewLoan({ request_number: this.windowModeParams['loanId'] })
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: LoanRequest) => {
          this.showLoadingModal = false;
          this.tasa_interes = data.tasa_interes;
          this.cantidadIngresada = data.cantidad_prestada;
          this.fecha_inicial = new Date(data.fecha_inicial.replace(/Z$/, ''));
          this.fechaMinima = this.fecha_inicial;
          this.customerFolderName = `${this.loanId}-${data.apellido_paterno_cliente.toUpperCase()}`;
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

          this.mainForm.patchValue({
            cantidad_prestada: data.cantidad_prestada,
            plazo: plazos.find((plazo) => plazo.id === data.id_plazo),
            fecha_inicial: this.fecha_inicial, // la fecha debe ser string mm-dd-yyyy
            observaciones: data.observaciones,
            formCliente: {
              nombre_cliente: data.nombre_cliente,
              apellido_paterno_cliente: data.apellido_paterno_cliente,
              apellido_materno_cliente: data.apellido_materno_cliente,
              telefono_fijo_cliente: data.telefono_fijo_cliente,
              telefono_movil_cliente: data.telefono_movil_cliente,
              correo_electronico_cliente: data.correo_electronico_cliente,
              ocupacion_cliente: data.ocupacion_cliente,
              curp_cliente: data.curp_cliente,
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
          this.customerFolderName = data.customerFolderName.toUpperCase();
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
    const additionalData = this.generateAdditionalDataObject();
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
  generateAdditionalDataObject(): any {
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

  updateCustomerFoundId(idsRecuperados: IdsRecuperados) {
    this.id_cliente_recuperado = idsRecuperados.id_cliente;
    this.id_aval_recuperado = idsRecuperados.id_aval;
  }

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
}
