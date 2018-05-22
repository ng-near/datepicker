export type DayDate = Date;
export type MonthDate = Date;

export const DAY_MILLIS = 8.64e+7;

export function ensureDayDate(date?: Date): DayDate {
  const copy = date === undefined ? new Date() : new Date(date.getTime());
  copy.setHours(0, 0, 0, 0);

  return copy;
}

export function ensureMonthDate(date?: Date): MonthDate {
  const result = ensureDayDate(date);
  result.setDate(1);

  return result;
}

/* isSameDay and isSameMonth have slightly different behavior when it comes to null/undefined
 *  - weirdeness comes from isSameDay that returns true when both date are null or undefined
 * We keep it that way because that's what we need inside selectors and that utility function
 * primarly usage is for those selectors.
 */

export function isSameDay(date1: Date | null | undefined, date2: Date | null | undefined) {
  return date1 === date2 || (
    date1 != null && date2 != null &&
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/* We don't test `date1 === date2` because it would complicate the function and both date being same ref
 * is not likely to happen in the usage of that function (as opposed to isDameDay()).
 */
export function isSameMonth(date1: Date | null | undefined, date2: Date | null | undefined) {
  return date1 != null && date2 != null &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

// from https://stackoverflow.com/a/6117889/873229
export function getIsoWeek(day: DayDate) {
  const closestThursday = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));

  // normalize week days so it start with monday (1) and end with sunday (7), that's how iso week is defined.
  const weekDay = closestThursday.getUTCDay() || 7;
  // Set to nearest Thursday, the one on the same week as current day
  closestThursday.setUTCDate(closestThursday.getUTCDate() + 4 - weekDay);

  const yearStart = new Date(Date.UTC(closestThursday.getFullYear(), 0, 1));

  return Math.ceil((((closestThursday.getTime() - yearStart.getTime()) / DAY_MILLIS) + 1) / 7);
}

export type DateObject = {
  year: number;
  month: number;
} & ({ date: number } | { day: number});

function isDateObject(v: any): v is DateObject {
  return typeof v === 'object' && v.year != null && v.month != null && (v.day != null || v.date != null);
}

export function convertDate(v: Date | DateObject | string | number | any) {
  if (v == null) {
    return new Date(NaN);
  }

  if (v instanceof Date) {
    return v;
  }

  if (isDateObject(v)) {
    return new Date(v.year, v.month, (<any>v).day || (<any>v).date);
  }

  // TODO see why ts complains
  return new Date(<any>v);
}
