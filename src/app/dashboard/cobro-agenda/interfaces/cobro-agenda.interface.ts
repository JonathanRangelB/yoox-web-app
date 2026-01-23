export interface requestAgenda {
  id_usuario: number;
  rol_usuario: string;
  options?: Options;
}

export interface Options {
  userIdFilter?: number;
  groupIdFilter?: number;
  managementIdFilter?: number;
}

export interface AgendaDeCobro {
  datosAgenda: DatosAgenda[];
  usersList: Group[];
  management: Group[];
  groups: Group[];
}

export interface DatosAgenda {
  id_cliente: number;
  nombreCliente: string;
  nombreGrupo: string;
  nombreGerencia: string;
  folioDeCredito: string;
  diaDePago: string;
  plazo: number;
  montoPrestamo: number;
  montoPago: number;
  fechaUltimoPago: Date;
  pagoActual: number;
  pagosRestante: number;
  totalPagos: number;
  saldoPendiente: number;
  numeroAtrasos: number;
  fechaVencimiento: Date;
  estatusPago: string;
}

export interface Group {
  ID: number;
  NOMBRE: string;
}
