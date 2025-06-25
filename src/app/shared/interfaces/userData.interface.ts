export interface LoginResponse {
  token: string;
}

export interface TokenUserData {
  ID: number;
  NOMBRE: string;
  ROL: string;
  ACTIVO: boolean;
  ID_GRUPO: null;
  ID_ROL: number;
  iat: number;
  exp: number;
}

export interface RefreshTokenResponse {
  token: string;
}
