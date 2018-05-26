import { FormStyle, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { ChangeDetectorRef, Inject, LOCALE_ID, OnDestroy, Pipe, PipeTransform } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Today } from '../utils/today';
import { DayDate, isSameDay, isSameMonth, MonthDate } from '../utils/utils';

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

@Pipe({
  name: 'isMonth',
  pure: true,
})
export class IsMonth implements PipeTransform {
  transform(day: DayDate, month: MonthDate) {
    return isSameMonth(day, month);
  }
}

@Pipe({
  name: 'isToday',
  pure: false,
})
export class IsToday implements PipeTransform, OnDestroy {

  private sub: Subscription;
  private today: Date;

  private lastArg: DayDate | undefined;
  private lastValue: boolean;

  constructor(today: Today, cdr: ChangeDetectorRef) {
    this.sub = today.observable.subscribe(d => {
      this.today = d;

      // cancel memoization
      this.lastArg = undefined;
      // trigger view update
      cdr.markForCheck();
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  transform(day: DayDate) {
    if (day === this.lastArg) return this.lastValue;

    this.lastArg = day;
    return this.lastValue = isSameDay(day, this.today);
  }
}
