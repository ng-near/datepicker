import { InjectionToken } from '@angular/core';
import { ValidationErrors, Validator } from '@angular/forms';

// types
export type DateValidatorFn = (date: Date) => ValidationErrors | null;

export type DateConverterFn = (v: any) => Date | null;

export interface DateValidator extends Validator {
  validateDate: DateValidatorFn;
}

// tokens
export const DATE_CONVERTER = new InjectionToken<DateConverterFn>('Date Converter');
export const DATE_CONSTRAINT = new InjectionToken<DateValidator>('Date Validator');
