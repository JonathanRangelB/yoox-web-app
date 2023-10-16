export interface UserData {
  recordset: Recordset[];
  rowsAffected: number;
  Autorization: string;
}

export interface Recordset {
  ID: number;
  NOMBRE: string;
  ROL: string;
  ACTIVO: boolean;
  ID_GRUPO: null;
  ID_ROL: number;
}
