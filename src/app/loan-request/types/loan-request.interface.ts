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
}
