import { FormStyle, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { DAY_MILLIS, isLeapYear, MonthDate, WEEK_MILLIS } from '../index';

export interface NameValue {
  name: string;
  value: number;
}

export const translationWidthMap = {
  'narrow': TranslationWidth.Narrow,
  'short': TranslationWidth.Short,
  'abbreviated': TranslationWidth.Abbreviated,
  'wide': TranslationWidth.Wide,
}

function normalizeWidth(width: TranslationWidth | keyof typeof translationWidthMap) {
  return typeof width === 'string' ? translationWidthMap[width] : width;
}

@Pipe({
  name: 'dayNames',
  pure: true,
})
export class DayNames implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  transform(width: TranslationWidth | keyof typeof translationWidthMap, locale = this.locale) {
    const days = getLocaleDayNames(locale, FormStyle.Standalone, normalizeWidth(width))
      .map((name, value) => ({name, value}));

    const firstDay = getLocaleFirstDayOfWeek(locale);
    if (firstDay !== 0) {
      days.unshift.apply(days, days.splice(firstDay));
    }

    return days;
  }
}

@Pipe({
  name: 'monthNames',
  pure: true,
})
export class MonthNames implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  // TODO exclude TranslationWidth.Short and 'short' from the type (need ts 2.8)
  transform(width: TranslationWidth | keyof typeof translationWidthMap, locale = this.locale) {
    return getLocaleMonthNames(locale, FormStyle.Standalone, normalizeWidth(width));
  }
}

export type YearOptions =
  {start: number, end: number} |
  {start: number, rend: number} |
  {rstart: number, end: number} |
  {rstart: number, rend: number}
;

function relativeYear(year?: number | null) {
  if (year == null) {
    year = 0;
  }

  return new Date().getFullYear() + year;
}

@Pipe({
  name: 'years',
  pure: true,
})
export class Years implements PipeTransform {

  transform(options: YearOptions): number[];
  transform(options: {start?: number, end?: number, rstart?: number, rend?: number}) {
    // TODO remove on prod
    if ((options.start == null && options.rstart == null) ||
        (options.end == null && options.rend == null)) {
        throw new Error('One start and one end must be defined');
      }

    const start = options.start != null ? options.start : relativeYear(options.rstart);
    const end = options.end != null ? options.end : relativeYear(options.rend);


    const years = [];

    const incr = start < end ? 1 : -1;
    for (let i = start; i !== end; i += incr) {
      years.push(i);
    }
    years.push(end);

    return years;
  }
}

export function getFirstWeek(month: MonthDate) {
  const leapYear = isLeapYear(month.getFullYear());

  const firstDayOfYear = new Date(month.getFullYear(), 0).getDay() || 7;
  const firstDayOfMonth = month.getDay() || 7;

  // +/- 1 week (need precision below)
  // const firstWeek = month.getMonth() * 5 - (month.getMonth() >> 1);

  switch (month.getMonth()) {
    case 0:
      return ;
    case 1:
      return 5;
    case 2:
      return firstDayOfMonth === 1 && leapYear ? 10 : 9;
    case 3:
      return firstDayOfMonth > 3 ? 13 : 14;
    case 4:
      return firstDayOfYear === 5 ? 17 : 18;
    case 5:
      return 0;
    case 6:
      return 0;
    case 7:
      return 0;
    case 8:
      return 0;
    case 9:
      return 0;
    case 10:
      return 0;
    case 11:
      return 0;
    case 12:
      return 0;
  }
}

@Pipe({
  name: 'isoWeeks',
  pure: true,
})
export class ISOWeeks implements PipeTransform {

  // from https://stackoverflow.com/a/6117889/873229
  transform(month: MonthDate) {
    const yearStart = new Date(Date.UTC(month.getFullYear(), 0));

    const monthStart = new Date(Date.UTC(month.getFullYear(), month.getMonth()));
    // Make Sunday's day number 7
    const monthStartDay = monthStart.getUTCDay() || 7;

    // Set to nearest Thursday: current date + 4 - current day number
    monthStart.setUTCDate(monthStart.getUTCDate() + 4 - monthStartDay);

    const weekStart = Math.ceil(( ( (monthStart.getTime() - yearStart.getTime()) / DAY_MILLIS) + 1) / 7);

    const monthSize = new Date(Date.UTC(month.getFullYear(), month.getMonth() + 1, 0)).getDate();
    const daysOnFirstWeek = (8 - monthStartDay);

    const weekEnd = weekStart + Math.ceil((monthSize - daysOnFirstWeek) / 7);

    const result = [];
    for (let w = weekStart, d = monthStart.getTime() - DAY_MILLIS * 3; w <= weekEnd; w++) {
      const days = [];
      for (let i = 0; i < 7; i++, d += DAY_MILLIS) {
        days.push(new Date(d));
      }

      let week = w;
      if (week === 0) {
        const lastYearStart = new Date(Date.UTC(month.getFullYear() - 1, 0));
        const lastYearWeeks = Math.round((yearStart.getTime() - lastYearStart.getTime()) / WEEK_MILLIS);
        week = lastYearWeeks;

        console.log(weekStart, weekEnd, week, yearStart, lastYearStart);
      }

      result.push({
        week, days
      })
    }

    // TODO replace 0 with last year number of weeks (52/53)

    return result;
  }
}

@Pipe({
  name: 'isoDays',
  pure: false,
})
export class Days implements PipeTransform {

  transform(year: number, week: number) {
    // memoization


  }
}
