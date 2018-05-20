import { FormStyle, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { getIsoWeek, MonthDate } from '../index';

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

@Pipe({
  name: 'days',
  pure: true,
})
export class Days implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) { }

  transform(month: MonthDate, showSixWeeks = false, locale_or_firstDayOfWeek?: string | number) {
    const firstDayOfWeek = typeof locale_or_firstDayOfWeek === 'number' ?
      locale_or_firstDayOfWeek :
      getLocaleFirstDayOfWeek(locale_or_firstDayOfWeek || this.locale)
    ;

    const lastDayOfWeek = (firstDayOfWeek + 6) % 7;

    const shiftToFirstDayOfWeek = ( (month.getDay() - firstDayOfWeek) + 7) % 7;
    const start = new Date(month.getFullYear(), month.getMonth(), month.getDate() - shiftToFirstDayOfWeek);

    const result = [];
    if (showSixWeeks === true) {
      // just go for 42 days
      for (let i = 0; i < 42; i++){
        result.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
      }
    } else {
      // compute end date and loop until we reach it
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const shiftToLastDayOfWeek = ( (lastDayOfWeek - end.getDay()) + 7) % 7;
      end.setDate(end.getDate() + shiftToLastDayOfWeek);

      let i = 0;
      let date: Date;
      do {
        result.push(date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i++));
      } while (date.getTime() < end.getTime())
    }

    return result;
  }
}

export interface ISOWeekOfYear {
  year: number;
  week: number;
}

@Pipe({
  name: 'isoWeeks',
  pure: true,
})
export class ISOWeeks implements PipeTransform {

  transform(monthDate: MonthDate, showSixMonth = false) {
    const year = monthDate.getFullYear();
    const firstWeek = getIsoWeek(monthDate);

    let weekCount: number;
    if (showSixMonth) {
      weekCount = 6;
    } else {
      const endMonth = new Date(Date.UTC(year, monthDate.getMonth() + 1, 0));
      // get how many days before the start of the first week
      const daysToMonday = (monthDate.getDay() || 7) - 1;
      // get how many days until the end of the last week
      const daysToSunday = 7 - (endMonth.getDay() || 7) ;

      weekCount = (endMonth.getDate() + daysToMonday + daysToSunday) / 7;
    }

    const result = [{week: firstWeek, year}];
    let week: number;

    if (firstWeek > 51) {
      result[0].year--;
      week = 1;
    } else {
      week = firstWeek + 1;
    }

    for (let end = week + weekCount - 1; week < end; week++) {
        result.push({week, year});
    }

    return result;
  }
}

@Pipe({
  name: 'isoDays',
  pure: true,
})
export class ISODays implements PipeTransform {

  transform(isoWeek: ISOWeekOfYear) {
    const { year } = isoWeek;

    const firstDay = new Date(year, 0).getDate() || 7;

    const shiftToFirstMonday = -(firstDay - 1);
    const shiftToWeek = (isoWeek.week - 1) * 7;
    const shiftToStartWeek = shiftToFirstMonday + shiftToWeek;

    const result = [];
    for (let i = 1; i < 8; i++) {
      result.push(new Date(year, 0, shiftToStartWeek + i));
    }

    return result;
  }
}
