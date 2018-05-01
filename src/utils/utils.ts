export function isValidNumber(n: number | undefined | null): n is number {
  return n != null && !isNaN(n!);
}

export type DayDate = Date;

export const DAY_MILLIS = 8.64e+7;
export const WEEK_MILLIS = 6.048e+8;

export function newDayDate(millis?: number): DayDate {
  let date = isValidNumber(millis) ? new Date(millis) : new Date();
  date.setHours(0, 0, 0, 0);

  return date;
}

export type MonthDate = Date;

export function newMonthDate(millis?: number): MonthDate {
  let date = newDayDate(millis);
  date.setDate(1);

  return date;
}

export function isSameDay(date1: Date | null | undefined, date2: Date | null | undefined) {
  return date1 === date2 || (
    date1 != null && date2 != null &&
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function isSameMonth(date1: Date | null, date2: Date | null) {
  return date1 != null && date2 != null &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

export function convertDate(v: any) {
  if (v instanceof Date) {
    return v;
  }

  if (typeof v === 'object' && v.year != null && v.month != null) {
    return new Date(v.year, v.month, v.day || v.date, v.hours, v.minutes, v.seconds, v.milliseconds);
  }

  const time = Date.parse(v);

  if (Number.isNaN(time)) {
    return null;
  }

  return new Date(time);
}
