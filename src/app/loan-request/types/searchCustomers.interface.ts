export interface SearchCustomerData {
  id?: number;
  curp?: string;
  nombre?: string;
  id_agente: number;
}

export interface Customer {
  id_cliente: number;
  nombre_cliente: string;
  telefono_fijo_cliente: string;
  telefono_movil_cliente: string;
  correo_electronico_cliente: string;
  id_agente: number;
  nombre_agente: string;
  ocupacion_cliente: string;
  curp_cliente: string;
  id_domicilio_cliente: number;
  tipo_calle_cliente: string;
  nombre_calle_cliente: string;
  numero_exterior_cliente: string;
  numero_interior_cliente: string;
  cruce_calles_cliente: string;
  colonia_cliente: string;
  municipio_cliente: string;
  estado_cliente: string;
  cp_cliente: string;
  referencias_dom_cliente: string;
  gmaps_url_location: string;
  id_aval: number;
  nombre_aval: string;
  telefono_fijo_aval: string;
  telefono_movil_aval: string;
  correo_electronico_aval: string;
  ocupacion_aval: string;
  curp_aval: string;
  id_domicilio_aval: number;
  tipo_calle_aval: null;
  nombre_calle_aval: string;
  numero_exterior_aval: string;
  numero_interior_aval: string;
  cruce_calles_aval: string;
  colonia_aval: string;
  municipio_aval: string;
  estado_aval: null;
  cp_aval: string;
  referencias_dom_aval: string;
}

export interface SearchGuarantorOptions {
  id: number;
  nombre: string;
  curp: string;
}

export interface Guarantor {
  id_aval: number;
  nombre: string;
  telefono_fijo: string;
  telefono_movil: string;
  correo_electronico: string;
  ocupacion: string;
  curp: string;
  id_domicilio: number;
  tipo_calle: string;
  nombre_calle: string;
  numero_exterior: string;
  numero_interior: string;
  cruce_calles: string;
  colonia: string;
  municipio: string;
  estado: string;
  cp: string;
  referencias_dom: string;
}
