import { PrestamosDetalle } from './../../../../models/db/prestamos_detalle';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { PagosService } from 'src/app/services/pagos-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Prestamos } from 'src/app/models/db/prestamos';
import { PrestamoConDetallesCompletos } from '../../../../models/db/prestamos';
import { SPAltaPago } from 'src/app/models/storedProcedures/SPAltaPago';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.scss',
})
export class PagosComponent implements OnInit {
  loading = false;
  hiddenTable = true;
  prestamo: Prestamos | undefined;
  folioForm!: FormGroup;
  prestamosDetalle: PrestamosDetalle[] = [];
  dialogIsVisible: boolean = false;
  header: string = 'Registro de semanas con folio 123456 del cliente Juan';
  numeroDeCliente: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private pagosService: PagosService
  ) {}

  ngOnInit(): void {
    this.folioForm = new FormGroup({
      folio: new FormControl(null, Validators.required),
    });
  }

  getSeverity(item: PrestamosDetalle): string {
    if (item.STATUS === 'PAGADO') return 'success';
    else if (item.STATUS === 'NO PAGADO') return 'warning';
    else if (item.STATUS === 'CANCELADO') return 'warning';
    else return 'danger';
  }

  activarBotonPago(item: PrestamosDetalle): boolean {
    if (item.STATUS === 'PAGADO') return true;
    else if (item.STATUS === 'CANCELADO') return true;
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
    const sPAltaPago: SPAltaPago = {
      ID_PRESTAMO: +item.ID_PRESTAMO,
      ID_MULTA: 0,
      NUMERO_SEMANA: item.NUMERO_SEMANA,
      ID_CLIENTE: this.numeroDeCliente,
      ID_USUARIO: +(localStorage.getItem('idusuario') || ''),
      CANTIDAD_PAGADA: item.CANTIDAD,
      FECHA_ACTUAL: new Date(),
      ID_COBRADOR: item.ID_COBRADOR, // asegurarme de obtener el id del cobrador y no hardcodearlo
    };

    if (!this.comprobarSecuenciaDeSemanas(item)) {
      this.pagosService.pay(sPAltaPago).subscribe({
        next: (data) => this.resgistrarPagoExitoso(item, data),
        error: (err) => this.errorAlRegistrarPago(err),
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `No se puede registrar el pago de la semana ${item.NUMERO_SEMANA} porque no es el siguiente pago a realizar`,
        icon: 'pi pi-exclamation-triangle',
        life: 5000,
      });
    }
  }

  resgistrarPagoExitoso(item: PrestamosDetalle, data: any) {
    console.log(data);
    this.prestamosDetalle = this.prestamosDetalle.map((pago) => {
      if (pago.NUMERO_SEMANA === item.NUMERO_SEMANA) {
        return {
          ...pago,
          STATUS: 'PAGADO',
        };
      } else return pago;
    });

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

  rechazarPago(item: PrestamosDetalle): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Acción cancelada',
      detail: `El pago correspondiendte a ${item.NUMERO_SEMANA} del folio ${item.ID_PRESTAMO} no se ha registrado`,
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
  }

  buscarFolio(): void {
    this.loading = true;
    this.hiddenTable = false;
    this.pagosService.getPaymentsById(this.folioForm.value.folio).subscribe({
      next: (pagos) => this.datosDelFolio(pagos),
      error: (err) => this.errorEnDatosDelFolio(err),
    });
  }

  datosDelFolio(pagos: PrestamoConDetallesCompletos): void {
    if (!pagos.prestamos) {
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
      this.prestamosDetalle = pagos.prestamosDetalle;
      this.prestamo = pagos.prestamos;
      this.numeroDeCliente = pagos.prestamos.ID_CLIENTE;
    }
    this.loading = false;
  }

  errorEnDatosDelFolio(err: unknown): void {
    console.log(err);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo obtener la información del folio',
      icon: 'pi pi-exclamation-triangle',
      life: 5000,
    });
    this.prestamo = undefined;
    this.loading = false;
  }

  comprobarSecuenciaDeSemanas(semana: PrestamosDetalle): boolean {
    const semanaCorrecta = this.prestamosDetalle.find(
      (semana) => semana.STATUS === 'NO PAGADO' || semana.STATUS === 'VENCIDO'
    );
    return semanaCorrecta?.NUMERO_SEMANA !== semana.NUMERO_SEMANA;
  }
}
