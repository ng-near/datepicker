import { DayDate, isSameDay } from '../utils';

// TODO can date be null ? undefined ?
export type DateConstraintFn = (date: DayDate) => {[key: string]: boolean} | null;

export const DateConstraints = {
  minDate(minDate: Date): DateConstraintFn {
    return date => date.getTime() > minDate.getTime() ? null : {
      minDate: true
    };
  },

  maxDate(maxDate: Date): DateConstraintFn {
    return date => date.getTime() < maxDate.getTime() ? null : {
      maxDate: true
    };
  },

  invalidDates(disabled: Date[]): DateConstraintFn {
    return date => disabled.some( d => isSameDay(date, d) ) ? {
      disabledDates: true
    } : null;
  },

  InvalidateWeekend: <DateConstraintFn>((date: Date) => date.getDay() !== 0 && date.getDay() !== 6 ? null : {
    disabledWeekend: true
  })
}
