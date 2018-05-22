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
