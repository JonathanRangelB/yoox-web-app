export interface RequestList {
  loanRequests: Requests[];
  usersList: User[];
}

export interface Requests {
  request_number: string;
  nombre_cliente: string;
  apellido_paterno_cliente: string;
  apellido_materno_cliente: string;
  cantidad_prestada: number;
  created_date: Date;
  loan_request_status: string;
  ID_AGENTE: number;
  nombre_agente: string;
  CNT: number;
}

export interface RequestListOptions {
  offSetRows: number;
  fetchRowsNumber: number;
  status?: string;
  nombreCliente?: string;
  folio?: string;
  userIdFilter?: number;
}

export type LoanStatus =
  | 'ACTUALIZAR'
  | 'APROBADO'
  | 'EN REVISION'
  | 'RECHAZADO'
  | 'TODOS';

export interface SearchOptions {
  status: LoanStatus;
  userIdFilter?: number;
}

export enum LoanStatusEnum {
  revision = 'EN REVISION',
  aprobado = 'APROBADO',
  rechazado = 'RECHAZADO',
  actualizar = 'ACTUALIZAR',
  todos = 'TODOS',
}

export interface User {
  NOMBRE: string;
  ID: number;
}
