import { PrestamosDetalle } from './prestamos_detalle';

export interface Prestamos {
  ID: number;
  ID_CLIENTE: number;
  ID_PLAZO: number;
  ID_USUARIO: number;
  CANTIDAD_PRESTADA: number;
  DIA_SEMANA: string;
  FECHA_INICIAL: Date;
  FECHA_FINAL_ESTIMADA: Date;
  FECHA_FINAL_REAL: Date;
  ID_COBRADOR: number;
  ID_CORTE: null;
  CANTIDAD_RESTANTE: number;
  CANTIDAD_PAGAR: number;
  STATUS: Status;
  FECHA_CANCELADO: null;
  USUARIO_CANCELO: null;
  ID_CONCEPTO: number;
  ID_MULTA: null;
  TASA_INTERES: number;
  ID_GRUPO_ORIGINAL: number;
}

export enum Status {
  Pagado = 'PAGADO',
  Refinanciado = 'REFINANCIADO',
  Cancelado = 'CANCELADO',
  Emitido = 'EMITIDO',
}

export interface PrestamoConDetallesCompletos {
  prestamos: Prestamos;
  prestamosDetalle: PrestamosDetalle[];
}
