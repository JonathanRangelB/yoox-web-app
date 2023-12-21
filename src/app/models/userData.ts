export interface UserData {
  user: User;
  Autorization: string;
}

export interface User {
  ID: number;
  NOMBRE: string;
  ROL: string;
  ACTIVO: boolean;
  ID_GRUPO: null;
  ID_ROL: number;
}
