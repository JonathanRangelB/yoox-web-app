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

  ngOnInit(): void {
    this.folioForm = this.fb.group({
      folio: [null, Validators.required],
    });
  }

  getSeverity({ STATUS }: PrestamosDetalle): severity {
    if (STATUS === 'PAGADO') return 'success';
    else if (STATUS === 'NO PAGADO') return 'warning';
    else if (STATUS === 'CANCELADO') return 'warning';
    else if (STATUS === 'ANULADO') return 'warning';
    else if (STATUS === 'REFINANCIADO') return 'warning';
    else return 'danger';
  }

  /**
   * Usado para definir el campo disabled en el boton de pagar
   * @param PrestamosDetalle El item  a evaluar
   * @returns boolean
   */
  activarBotonPago({ STATUS }: PrestamosDetalle): boolean {
    if (STATUS === 'PAGADO') return true;
    else if (STATUS === 'CANCELADO') return true;
    else if (STATUS === 'ANULADO') return true;
    else if (STATUS === 'REFINANCIADO') return true;
    else return false;
  }

  pagar(item: PrestamosDetalle): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de pagar ${item.CANTIDAD} correspondientes a la semana ${item.NUMERO_SEMANA} para el folio ${item.ID_PRESTAMO}?`,
      accept: () => this.registrarPago(item),
      reject: () => this.rechazarPago(item),
    });
  }

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
      error: (err) => this.errorAlRegistrarPago(err),
    });
  }

  resgistrarPagoExitoso(item: PrestamosDetalle) {
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
      detail: `El pago correspondiendte a ${item.NUMERO_SEMANA} del folio ${item.ID_PRESTAMO} se ha registrado`,
      icon: 'pi pi-check',
      life: 5000,
    });
  }

  errorAlRegistrarPago(err: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `Ocurrio un error al interntar registrar el pago: ${err.error.message}`,
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
    console.log(err);
  }

  rechazarPago({ NUMERO_SEMANA, ID_PRESTAMO }: PrestamosDetalle): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acción cancelada',
      detail: `El pago correspondiendte a ${NUMERO_SEMANA} del folio ${ID_PRESTAMO} no se ha registrado`,
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
  }

  buscarFolio(): void {
    this.cargandoDatosDePrestamo = true;
    this.hideTable = false;
    this.pagosService.getPaymentsById(this.folioForm.value.folio).subscribe({
      next: (prestamoConDetallesCompletos) =>
        this.datosDelFolio(prestamoConDetallesCompletos),
      error: (err) => this.errorEnDatosDelFolio(err),
    });
  }

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

    // si llegue a este punto todo es correcto y se puede registrar el pago
    return true;
  }
}
