/* eslint-disable no-useless-escape */
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { ExistingCurpValidationService } from '../services/validacion-curp.service';
import { ValidatorExistingPhoneService } from '../services/validacion-telefonos.service';
import { phoneType, tableType } from '../types/services.type';

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
    if (!value) return null;
    return value.match(emailRegex) ? null : { invalidEmail: value };
  };
}

export function atLeastOneValidator(controlNames: string[]): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    // if (!formGroup || !formGroup.get) {
    //   return null;
    // }

    const isValid = controlNames.some((controlName) => {
      const control = formGroup.get(controlName);
      return (
        control &&
        control.value &&
        control.value.length === 10 &&
        !control.errors
      );
    });

    return isValid ? null : { atLeastOneRequired: true };
  };
}

export function existingCurpAsyncValidator(
  existingCurpValidationService: ExistingCurpValidationService,
  table: string
): AsyncValidatorFn {
  return ({
    value: curp,
  }: AbstractControl): Observable<null | ValidationErrors> => {
    if (!curp) return of(null);
    return existingCurpValidationService
      .validate({
        curp,
        table,
      })
      .pipe(
        map(() => {
          return {
            curpExistente: 'La curp ya existe',
          };
        }),
        catchError(() => {
          return of(null);
        })
      );
  };
}

export function existingPhonesAsyncValidator(
  validatorExistingPhoneService: ValidatorExistingPhoneService,
  table: tableType,
  type: phoneType
): AsyncValidatorFn {
  return ({
    value: phone,
  }: AbstractControl): Observable<null | ValidationErrors> => {
    if (!phone || phone.length !== 10) return of(null);
    const payload = {
      [type]: phone,
      table,
    };
    return validatorExistingPhoneService.validate(payload).pipe(
      map(() => {
        return { telefonoExistente: 'el telefono ya existe' };
      }),
      catchError(() => {
        return of(null);
      })
    );
  };
}
