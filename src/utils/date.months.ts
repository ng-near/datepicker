import { DefaultIterableDiffer, IterableDiffer, IterableDifferFactory, TrackByFunction } from '@angular/core';

export class DateMonths implements Iterable<Date> {

  private months: Date[];

  get month() {
    return this.months[0];
  }

  constructor(...months: Date[]) {
    this.months = months;
  }

  [Symbol.iterator] = () => this.months[Symbol.iterator]();

  shiftMonth(amount: number, idx?: number) {
    if (amount === 0)
      return this;

      return this.changeMonths(date => new Date(date.getFullYear(), date.getMonth() + amount), idx);
  }

  shiftYear(amount: number, idx?: number) {
    if (amount === 0)
      return this;

    return this.changeMonths(date => new Date(date.getFullYear() + amount, date.getMonth()), idx);
  }

  changeMonth(month: number, idx?: number) {
    if ( month < 0 || month > 11 || this.checkMonth(d => d.getMonth() === month, idx)) {
      return this;
    }

    return this.changeMonths(date => new Date(date.getFullYear(), month), idx);
  }

  changeYear(year: number, idx?: number) {
    if (this.checkMonth(d => d.getFullYear() === year, idx)) {
      return this;
    }

    return this.changeMonths(date => new Date(year, date.getMonth()), idx);
  }

  toMonth(year: number, month: number, idx?: number) {
    if (this.checkMonth(d => d.getFullYear() === year && d.getMonth() === month, idx)) {
      return this;
    }

    return this.changeMonths(date => new Date(year, month), idx);
  }

  private checkMonth(predicate: (date: Date) => boolean, idx: number | undefined) {
    if (idx == null) {
      return this.months.every(predicate);
    } else {
      const month = this.months[idx];
      return month !== undefined && predicate(month);
    }
  }

  private changeMonths(mapFn: (date: Date) => Date, idx: number | undefined) {
    return new DateMonths(...this.months.map( (d, i) =>
      idx === undefined || i === idx ? mapFn(d) : d
    ));
  }
}

export class DateMonthsIterableDiffer implements IterableDifferFactory {
  supports(objects: any): boolean {
    return objects instanceof DateMonths;
  }
  create<V>(trackByFn: TrackByFunction<V> = index => index): IterableDiffer<V> {
    return new DefaultIterableDiffer<V>(trackByFn);
  }
}
