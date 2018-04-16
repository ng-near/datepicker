import { NgForOfContext } from '@angular/common';
import {
  DefaultIterableDiffer,
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { DatepickerSelect } from '../selection/base.select';

// TODO remove differ, force the usage of immutable Date and do a simple loop over new value should be enough here

export class DateNavigator {
  constructor(public months: Date[] = []) {}

  moveMonth(amount: number, monthDate?: Date) {
    if (amount === 0)
      return this.months;

      return this.changeMonth(date => new Date(date.getFullYear(), date.getMonth() + amount), monthDate);
  }

  moveYear(amount: number, monthDate?: Date) {
    if (amount === 0)
      return this.months;

    return this.changeMonth(date => new Date(date.getFullYear() + amount, date.getMonth()), monthDate);
  }

  toMonth(month: number, monthDate?: Date) {
    if ( month < 0 || month > 11 ||
      monthDate === undefined ? this.months.every(d => d.getMonth() === month) : month === monthDate.getMonth())
      return this.months;

    return this.changeMonth(date => new Date(date.getFullYear(), month), monthDate);
  }

  toYear(year: number, monthDate?: Date) {
    if ( monthDate === undefined ? this.months.every(d => d.getFullYear() === year) : year === monthDate.getFullYear())
      return this.months;

    return this.changeMonth(date => new Date(year, date.getMonth()), monthDate);
  }

  private changeMonth(mapFn: (date: Date) => Date, monthDate?: Date) {
    const isMonthUndefined = monthDate === undefined;
    return this.months.map( (d, i) =>
      isMonthUndefined || d === monthDate ? mapFn(d) : d
    );
  }
}

export class MonthContext extends NgForOfContext<Date> {

  navigator = new DateNavigator();

  constructor($implicit: Date, public selector: DatepickerSelect<any>) {
     super($implicit, null!, -1, -1);
  }

  get count() { return (<Date[]>this.ngForOf).length; }

  set count(c: number) { /* noop, only avoiding error from NgForOfContext */ }

  setMonths(months: Date[]) {
    this.navigator.months = this.ngForOf = months;
  }
}

@Directive({
  selector: '[forMonth][forMonthOf]'
})
export class ForMonthOf implements OnChanges {

  @Input('forMonthOf') months: Date[] | null | undefined;

  private differ = new DefaultIterableDiffer<Date>(index => index)

  constructor(private template: TemplateRef<MonthContext>, private viewContainer: ViewContainerRef, private select: DatepickerSelect<any>) {}

  ngOnChanges() {
    const changes = this.differ.diff(this.months!);
    if (changes) {
      changes.forEachOperation( (record, adjustedPreviousIndex, currentIndex) => {
        // added
        if (record.previousIndex === null) {
          this.viewContainer.createEmbeddedView(
              this.template, this.newContext(record.item) );
        }
        // removed
        else if (currentIndex === null) {
          this.viewContainer.remove(adjustedPreviousIndex!);
        }
        // moved
        else {
          const view = <EmbeddedViewRef<MonthContext>>this.viewContainer.get(adjustedPreviousIndex!)!;
          this.viewContainer.move(view, currentIndex);
          // view.context.$implicit = record.item;
        }
      });

      // if we get inside the loop this means this.months isn't null
      const months = this.months!;
      for (let i = 0, ilen = this.viewContainer.length; i < ilen; i++) {
        const context = (<EmbeddedViewRef<MonthContext>>this.viewContainer.get(i)).context;

        // not always needed but feels better to do it here
        // rather than going through another loop with only the views that need $implicit update
        context.$implicit = months[i];

        context.setMonths(months!);
        context.index = i;
      }
    }
  }

  private newContext(date: Date) {
    return new MonthContext(date, this.select);
  }
}
