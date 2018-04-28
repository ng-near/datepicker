import { newDayDate } from '..';
import { DayDate, isSameDay } from '../utils';

// TODO can date be null ? undefined ?
export type DateConstraintFn = (date: DayDate) => {[key: string]: boolean} | null;

export const DateConstraints = {
  minDate(minDate: Date): DateConstraintFn {
    const minTime = newDayDate(minDate.getTime()).getTime();

    return date => date.getTime() < minTime ? {
      minDate: true
    } : null;
  },

  maxDate(maxDate: Date): DateConstraintFn {
    const maxTime = newDayDate(maxDate.getTime()).getTime();

    return date => date.getTime() > maxTime ? {
      maxDate: true
    } : null;
  },

  invalidDates(disabled: Date[]): DateConstraintFn {
    return date => disabled.some(d => isSameDay(date, d)) ? {
      disabledDates: true
    } : null;
  },

  // TODO use locale to define weekend
  invalidateWeekend(date: Date, locale: string) {
    // const {day1, day2} = getLocaleWeekEndRange(locale);
    return date.getDay() !== 0 && date.getDay() !== 6 ? null : {
      disabledWeekend: true
    };
  }
}
