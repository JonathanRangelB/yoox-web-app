export type TokenValidationResponse = {
  isValid: boolean;
  error?: string;
};

export interface user {
  ID: number;
  NOMBRE: string;
  ROL: string;
  ACTIVO: boolean;
  ID_GRUPO: null;
  ID_ROL: number;
}
