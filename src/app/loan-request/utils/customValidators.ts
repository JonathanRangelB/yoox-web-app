import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Las funciones validadoras regresan null cuando no hay error.
// Debe regresar cualquier tipo de objeto cuando hay error

export function length10(): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (!value) return { noValue: null };
    return value.length !== 10 ? { lenght10NotMatch: value } : null;
  };
}

export function curpValidator(): ValidatorFn {
  const curpRegex =
    /^([A-Za-z][AEIOUXaeioux][A-Za-z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]{3}[A-Za-z\d])(\d)$/;
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (!value) return { noValue: null };
    const upperCaseCurp = value.toUpperCase();
    return upperCaseCurp.match(curpRegex) ? null : { invalidCurp: value };
  };
}
