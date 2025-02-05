export interface dropDownCollection {
  name: string;
  value: string;
}

export interface CurrentUser {
  ID: number;
  NOMBRE: string;
  ROL: string;
  ACTIVO: boolean;
  ID_GRUPO: number;
  ID_ROL: number;
}

export interface IdsRecuperados {
  id_cliente: number;
  id_aval: number;
  id_domicilio_cliente: number;
  id_domicilio_aval: number;
}

export interface LoanRequest {
  id: number;
  id_loan: number;
  request_number: string;
  loan_request_status: string;
  id_agente: number;
  id_grupo_original: number;
  id_cliente: null;
  nombre_cliente: string;
  apellido_paterno_cliente: string;
  apellido_materno_cliente: string;
  telefono_fijo_cliente: string;
  telefono_movil_cliente: string;
  correo_electronico_cliente: string;
  ocupacion_cliente: string;
  curp_cliente: string;
  tipo_calle_cliente: string;
  nombre_calle_cliente: string;
  numero_exterior_cliente: string;
  numero_interior_cliente: string;
  colonia_cliente: string;
  municipio_cliente: string;
  estado_cliente: string;
  cp_cliente: string;
  id_domicilio_cliente: number;
  referencias_dom_cliente: string;
  id_aval: null;
  nombre_aval: string;
  apellido_paterno_aval: string;
  apellido_materno_aval: string;
  telefono_fijo_aval: string;
  telefono_movil_aval: string;
  correo_electronico_aval: string;
  curp_aval: string;
  tipo_calle_aval: string;
  nombre_calle_aval: string;
  numero_exterior_aval: string;
  numero_interior_aval: string;
  colonia_aval: string;
  municipio_aval: string;
  estado_aval: string;
  cp_aval: string;
  id_domicilio_aval: number;
  referencias_dom_aval: string;
  id_plazo: number;
  cantidad_prestada: number;
  dia_semana: string;
  fecha_inicial: string;
  fecha_final_estimada: Date;
  cantidad_pagar: number;
  tasa_de_interes: number;
  observaciones: string;
  created_by: number;
  created_date: Date;
  modified_by: number;
  modified_date: Date;
  closed_by: number;
  closed_date: Date;
  status_code: null;
  id_looan: number;
}

export interface Plazo {
  semanas_plazo: string;
  tasa_de_interes: number;
  id: number;
  semanas_refinancia: string;
}

export type WindowMode = 'view' | 'new';
export type LoanMode = 'new' | 'update';
