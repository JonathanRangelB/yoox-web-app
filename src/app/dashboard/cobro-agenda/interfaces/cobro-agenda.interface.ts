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
  diaDePago: string;
  fechaUltimoPago: Date;
  fechaVencimiento: Date;
  folioDeCredito: string;
  id_cliente: number;
  montoPago: number;
  montoPrestamo: number;
  nombreCliente: string;
  nombreGerencia: string;
  nombreGrupo: string;
  numeroAtrasos: number;
  pagoActual: number;
  pagosRestante: number;
  plazo: number;
  saldoPendiente: number;
  totalPagos: number;
  totalSemanasPrestamo: number;
}

export interface Group {
  ID: number;
  NOMBRE: string;
}
