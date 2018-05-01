import { getLocaleWeekEndRange } from '@angular/common';

import { newDayDate } from '..';
import { DayDate, isSameDay } from '../utils/utils';


// TODO can date be null ? undefined ?
export type DateConstraintFn = (date: DayDate) => {[key: string]: boolean} | null;

export const DateConstraints = {
  minDate(minDate: DayDate): DateConstraintFn {
    const minTime = newDayDate(minDate.getTime()).getTime();

    return date => date.getTime() < minTime ? {
      minDate: true
    } : null;
  },

  maxDate(maxDate: DayDate): DateConstraintFn {
    const maxTime = newDayDate(maxDate.getTime()).getTime();

    return date => date.getTime() > maxTime ? {
      maxDate: true
    } : null;
  },

  disabledDates(disabled: DayDate[]): DateConstraintFn {
    return date => disabled.some(d => isSameDay(date, d)) ? {
      disabledDates: true
    } : null;
  },

  // we make locale mandatory otherwise user may think this will use LOCALE_ID by default
  notWeekend(locale: string): DateConstraintFn {
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
}
