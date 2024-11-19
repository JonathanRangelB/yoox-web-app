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

export interface ClientesEncontrados {
  id: number;
  curp: string;
  nombre: string;
  ocupacion: string;
  correo_electronico: string;
}
