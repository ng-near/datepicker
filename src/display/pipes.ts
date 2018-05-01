import { FormStyle, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

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

