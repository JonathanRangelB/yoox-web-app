/* eslint-disable no-useless-escape */
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { map, Observable, of, switchMap, tap, timer } from 'rxjs';

// Las funciones validadoras regresan null cuando no hay error.
// Debe regresar cualquier tipo de objeto cuando hay error

export function lengthValidator(desiredLength: number): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (!value) return { noValue: null };
    // converts value to string in case it was a number
    return `${value}`.length !== desiredLength
      ? { lenghtNotMatch: desiredLength }
      : null;
  };
}

export function curpValidator(): ValidatorFn {
  const curpRegex =
    /^([A-Za-z][AEIOUXaeioux][A-Za-z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Zb-df-hj-np-tv-z]{3}[A-Za-z\d])(\d)$/;
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (!value) return { noValue: null };
    return value.match(curpRegex) ? null : { invalidCurp: value };
  };
}

export function emailValidator(): ValidatorFn {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (!value) return { noValue: null };
    return value.match(emailRegex) ? null : { invalidEmail: value };
  };
}

// TODO: este validador debe de usar un service, queda pendiente su implementacion
// tambien faltaria la implementacion de un servicio para este modulo
export function asyncValidator(): AsyncValidatorFn {
  return ({ value }: AbstractControl): Observable<ValidationErrors | null> => {
    if (!value) return of(null);
    return timer(1000).pipe(
      switchMap(() => of(null)),
      tap(console.log),
      map((temporal) => {
        console.log('valor evaluado: ', value);
        return temporal;
      })
    );
  };
}
