import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';

import { obtenerFechaEnEspanol } from 'src/app/shared/utils/date.utils';
import { PagosService } from '../../services/pagos-service';
import {
  PrestamoConDetallesCompletos,
  Status,
} from '../../interfaces/prestamos.interface';
import { Prestamos } from 'src/app/pagos/interfaces/prestamos.interface';
import { PrestamosDetalle } from '../../interfaces/prestamos_detalle.interface';
import { SPAltaPago } from 'src/app/pagos/interfaces/SPAltaPago.interface';

type severity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warning'
  | 'danger'
  | 'contrast'
  | undefined;

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent implements OnInit {
  public cargandoDatosDePrestamo = false;
  public hideTable = true;
  public prestamo: Prestamos | undefined;
  public folioForm!: FormGroup;
  public prestamosDetalle: PrestamosDetalle[] = [];
  public dialogIsVisible: boolean = false;
  public numeroDeCliente: number = 0;
  public pagosPendientes: number = 0;
  public totalPagos: number = 0;
  public pagosAdelantadosPermitidos?: number;
  public pagosAdelantadosPermitidosRestantes?: number;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private pagosService: PagosService,
    private fb: FormBuilder
  ) {}

  /**
   * Initializes the component by creating a form group for the folio input field.
   *
   * This function sets up the initial state of the component by creating a form group
   * using the FormBuilder service. The form group has a single control named 'folio'
   * with a required validator.
   *
   * @return {void} This function does not return anything.
   */
  ngOnInit(): void {
    this.folioForm = this.fb.group({
      folio: [null, Validators.required],
    });
  }

  /**
   * Returns the severity level based on the status of a PrestamosDetalle object.
   *
   * @param {PrestamosDetalle} item - The PrestamosDetalle object to check the status of.
   * @return {severity} The severity level: 'success', 'warning', 'danger', or undefined.
   */
  getSeverity({ STATUS }: PrestamosDetalle): severity {
    if (STATUS === 'PAGADO') return 'success';
    else if (STATUS === 'NO PAGADO') return 'warning';
    else if (STATUS === 'CANCELADO') return 'warning';
    else if (STATUS === 'ANULADO') return 'warning';
    else if (STATUS === 'REFINANCIADO') return 'warning';
    else return 'danger';
  }

  /**
   * Determines whether to enable or disable a button based on the status of a loan.
   *
   * @param {PrestamosDetalle} item - The loan item to check the status of.
   * @return {boolean} Returns true if the status is 'PAGADO', 'CANCELADO', 'ANULADO', or 'REFINANCIADO', otherwise false.
   */
  activarBotonPago({ STATUS }: PrestamosDetalle): boolean {
    if (STATUS === 'PAGADO') return true;
    else if (STATUS === 'CANCELADO') return true;
    else if (STATUS === 'ANULADO') return true;
    else if (STATUS === 'REFINANCIADO') return true;
    else return false;
  }

  /**
   * Displays a confirmation dialog to the user asking if they want to pay a certain amount for a specific week and loan.
   * If the user accepts, it calls the registrarPago method with the given item.
   * If the user rejects, it calls the rechazarPago method with the given item.
   *
   * @param {PrestamosDetalle} item - The item containing the amount and week number of the payment, as well as the loan ID.
   * @return {void} This function does not return anything.
   */
  pagar(item: PrestamosDetalle): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de pagar ${item.CANTIDAD} correspondientes a la semana ${item.NUMERO_SEMANA} para el folio ${item.ID_PRESTAMO}?`,
      accept: () => this.registrarPago(item),
      reject: () => this.rechazarPago(item),
    });
  }

  /**
   * Registers a payment for a given loan item.
   *
   * @param {PrestamosDetalle} item - The loan item to register the payment for.
   * @return {void} This function does not return anything.
   */
  registrarPago(item: PrestamosDetalle): void {
    const usuarioActual: number = +(localStorage.getItem('idusuario') ?? '');
    item.LOADING = true;
    const sPAltaPago: SPAltaPago = {
      ID_PRESTAMO: +item.ID_PRESTAMO,
      ID_MULTA: 0,
      NUMERO_SEMANA: item.NUMERO_SEMANA,
      ID_CLIENTE: this.numeroDeCliente,
      ID_USUARIO: usuarioActual,
      CANTIDAD_PAGADA: item.CANTIDAD,
      FECHA_ACTUAL: new Date(),
      ID_COBRADOR: usuarioActual, // asegurarme de obtener el id del cobrador y no hardcodearlo
    };
    if (!this.comprobarSecuenciaDeSemanas(item)) {
      item.LOADING = false;
      return;
    }
    if (!this.esPagoAdelantadoPermitido(item)) {
      item.LOADING = false;
      return;
    }

    // Si las validaciones anteriores pasaron, se procede a registrar el pago
    this.pagosService.pay(sPAltaPago).subscribe({
      next: () => this.resgistrarPagoExitoso(item),
      error: (err) => this.errorAlRegistrarPago(item, err),
    });
  }

  /**
   * Updates the payment status of a given item to 'PAGADO' and updates the UI with the updated information.
   *
   * @param {PrestamosDetalle} item - The item to update the payment status for.
   * @return {void} This function does not return anything.
   */
  resgistrarPagoExitoso(item: PrestamosDetalle): void {
    item.LOADING = false;
    this.prestamosDetalle = this.prestamosDetalle.map((pago) => {
      if (pago.NUMERO_SEMANA === item.NUMERO_SEMANA) {
        return {
          ...pago,
          STATUS: 'PAGADO',
        };
      } else return pago;
    });

    // Actualiza la informacion del prestamo para mostrarlo en la UI
    this.pagosPendientes = this.pagosPendientes + 1;
    this.prestamo!.CANTIDAD_RESTANTE =
      this.prestamo!.CANTIDAD_RESTANTE - item.CANTIDAD;
    if (this.totalPagos === this.pagosPendientes) {
      this.prestamo!.STATUS = Status.Pagado;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Pago exitoso',
      detail: `El pago de la semana ${item.NUMERO_SEMANA} correspondiente al folio ${item.ID_PRESTAMO} se ha registrado`,
      icon: 'pi pi-check',
      life: 5000,
    });
  }

  /**
   * Handles the error that occurs when attempting to register a payment.
   *
   * @param {any} err - The error object containing information about the error.
   * @return {void} This function does not return anything.
   */
  errorAlRegistrarPago(item: PrestamosDetalle, err: any): void {
    item.LOADING = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `${err.error.message}`,
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
    console.log(err);
  }

  /**
   * Adds a warning message to the message service with the details of the rejected payment.
   *
   * @param {PrestamosDetalle} prestamosDetalle - The details of the rejected payment.
   * @return {void} This function does not return anything.
   */
  rechazarPago({ NUMERO_SEMANA, ID_PRESTAMO }: PrestamosDetalle): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acción cancelada',
      detail: `El pago de la semana ${NUMERO_SEMANA} correspondiente al folio ${ID_PRESTAMO} no se ha registrado`,
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
  }

  /**
   * Retrieves payment details by folio and updates the component state accordingly.
   *
   * @return {void} This function does not return anything.
   */
  buscarFolio(): void {
    this.cargandoDatosDePrestamo = true;
    this.hideTable = false;
    this.pagosService.getPaymentsById(this.folioForm.value.folio).subscribe({
      next: (prestamoConDetallesCompletos: PrestamoConDetallesCompletos) =>
        this.datosDelFolio(prestamoConDetallesCompletos),
      error: (err: unknown) => this.errorEnDatosDelFolio(err),
    });
  }

  /**
   * Updates the component state with the retrieved payment details.
   *
   * @param {PrestamoConDetallesCompletos} prestamoConDetallesCompletos - The object containing the retrieved payment details.
   * @return {void} This function does not return anything.
   */
  datosDelFolio(
    prestamoConDetallesCompletos: PrestamoConDetallesCompletos
  ): void {
    if (!prestamoConDetallesCompletos.prestamos) {
      this.prestamosDetalle = [];
      this.prestamo = undefined;
      this.messageService.add({
        severity: 'warn',
        summary: 'No se encontro el folio',
        detail: 'El folio no existe o no esta asignado a su usuario',
        icon: 'pi pi-exclamation-triangle',
        life: 5000,
      });
    } else {
      const { prestamos, prestamosDetalle, pagosAdelantadosPermitidos } =
        prestamoConDetallesCompletos;
      this.prestamosDetalle = prestamosDetalle;
      this.prestamo = prestamos;
      this.pagosAdelantadosPermitidos = pagosAdelantadosPermitidos;
      this.numeroDeCliente = prestamos.ID_CLIENTE;
      this.totalPagos = prestamosDetalle.length;
      this.pagosPendientes = prestamosDetalle.filter(
        ({ STATUS }) =>
          STATUS === 'PAGADO' ||
          STATUS === 'CANCELADO' ||
          STATUS === 'ANULADO' ||
          STATUS === 'REFINANCIADO'
      ).length;
    }
    this.cargandoDatosDePrestamo = false;
  }

  /**
   * Handles the error when retrieving information for a specific loan.
   *
   * @param {unknown} err - The error object.
   * @return {void} This function does not return anything.
   */
  errorEnDatosDelFolio(err: unknown): void {
    this.prestamosDetalle = [];
    this.prestamo = undefined;
    console.log(err);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo obtener la información del folio',
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
    this.prestamo = undefined;
    this.cargandoDatosDePrestamo = false;
  }

  /**
   * Checks if the given week is part of the correct sequence of weeks.
   *
   * @param {PrestamosDetalle} semana - The week to check.
   * @return {boolean} Returns true if the week is part of the correct sequence, false otherwise.
   */
  comprobarSecuenciaDeSemanas(semana: PrestamosDetalle): boolean {
    const semanaCorrecta = this.prestamosDetalle.find(
      ({ STATUS }) => STATUS === 'NO PAGADO' || STATUS === 'VENCIDO'
    );
    if (semanaCorrecta?.NUMERO_SEMANA !== semana.NUMERO_SEMANA) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `No se puede registrar el pago de la semana ${semana.NUMERO_SEMANA} porque no es el siguiente pago a realizar`,
        icon: 'pi pi-exclamation-triangle',
        life: 5000,
      });
      return false;
    }
    return true;
  }

  /**
   * Returns the corresponding icon class based on the loading status and status of a loan.
   *
   * @param {PrestamosDetalle} loanDetail - The loan detail object containing the loading status and status.
   * @return {string} The icon class corresponding to the loading status and status.
   */
  obtenerIcono({ LOADING, STATUS }: PrestamosDetalle): string {
    if (LOADING) return 'pi pi-spin pi-spinner';
    else if (STATUS === 'PAGADO') return 'pi pi-check';
    else if (STATUS === 'NO PAGADO') return 'pi pi-money-bill';
    else if (STATUS === 'CANCELADO') return 'pi pi-times';
    else if (STATUS === 'VENCIDO') return 'pi pi-money-bill';
    else if (STATUS === 'ANULADO') return 'pi pi-money-bill';
    else if (STATUS === 'REFINANCIADO') return 'pi pi-money-bill';
    else return 'pi pi-question';
  }

  /**
   * Checks if the given loan detail is within the allowed payment advance period.
   *
   * @param {PrestamosDetalle} semana - The loan detail to check.
   * @return {boolean} True if the payment is within the allowed period, false otherwise.
   */
  esPagoAdelantadoPermitido(semana: PrestamosDetalle): boolean {
    if (!this.pagosAdelantadosPermitidos) return false;
    // Inicializo la fecha actual y posteriormente la hora, minuto y segundo los pongo en 0 para evitar que por cambios de zona horaria existan comportamientos inesperados como por ejemplo el cambio de dia anterior por la zona horaria en la cual nos encontramos, actualmente -6 hrs. GMT
    // NOTA: tengo que manejar la fecha en formato utc ya que el backend me envia la fecha de vencimiento en formato utc y necesito que ambos tengan la misma zona horaria
    const fechaMaxima = new Date();
    fechaMaxima.setHours(0, 0, 0);
    fechaMaxima.setDate(
      fechaMaxima.getDate() + this.pagosAdelantadosPermitidos * 7
    );

    // Obtengo la fecha de vencimiento de la semana a la cual se quiere registrar el pago. La fecha esta en formato utc, que es lo que me da el backend
    const fechaDeVencimiento = new Date(semana.FECHA_VENCIMIENTO.toString());

    // Valido que la fecha de vencimiento no sea mayor a la fecha maxima permitida, en caso de serlo no se puede registrar el pago y regreso false
    if (fechaMaxima <= fechaDeVencimiento) {
      this.messageService.add({
        severity: 'error',
        summary: 'Pago adelantado no permitido',
        detail: `Para este cliente solo se permiten registrar pagos con fecha de vencimiento menor o igual a: ${obtenerFechaEnEspanol(fechaMaxima)}`,
        icon: 'pi pi-exclamation-triangle',
        life: 5000,
      });
      return false;
    }

    return true;
  }
}
