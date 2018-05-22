import { getLocaleWeekEndRange } from '@angular/common';

import { DayDate } from '../index';
import { isSameDay } from '../utils/utils';
import { DateValidatorFn } from './model';

export namespace DateValidators {
  export function minDate(minDate: DayDate): DateValidatorFn {
    return date => date.getFullYear() < minDate.getFullYear() || date.getMonth() < minDate.getMonth() || date.getDate() < minDate.getDate() ? {
      minDate: true
    } : null;
  };

  export function maxDate(maxDate: DayDate): DateValidatorFn {
    return date => date.getFullYear() > maxDate.getFullYear() || date.getMonth() > maxDate.getMonth() || date.getDate() > maxDate.getDate() ? {
      maxDate: true
    } : null;
  }

  export function disabledDates(disabled: DayDate[]): DateValidatorFn {
    return date => disabled.some(d => isSameDay(date, d)) ? {
      disabledDates: true
    } : null;
  }

  // we make locale mandatory otherwise user may think this will use LOCALE_ID by default
  export function notWeekend(locale: string): DateValidatorFn {
    const [startWE, endWE] = getLocaleWeekEndRange(locale);

    const isNotWeekend: (day: number) => boolean =
      startWE <= endWE ?
        day => day < startWE || day > endWE :
        day => day > endWE && day < startWE
    ;

    return date => isNotWeekend(date.getDay()) ? null : {
      disabledWeekend: true
    };
  }

  export function compose(validators: DateValidatorFn[]): DateValidatorFn {
    if (validators == null) {
      return () => null;
    }

    return date => {
      const errors = {};

      for (let validate of validators) {
        const error = validate(date);
        if (error != null) {
          Object.assign(errors, error);
        }
      }

      return Object.keys(errors).length === 0 ? null : errors;
    };
  }
}
