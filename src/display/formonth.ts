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

export class DateNavigator {
  constructor(public months: Date[] = []) {}

  shiftMonth(amount: number, idx?: number) {
    if (amount === 0)
      return this.months;

      return this.changeMonths(date => new Date(date.getFullYear(), date.getMonth() + amount), idx);
  }

  shiftYear(amount: number, idx?: number) {
    if (amount === 0)
      return this.months;

    return this.changeMonths(date => new Date(date.getFullYear() + amount, date.getMonth()), idx);
  }

  toMonth(month: number, idx: number) {
    if ( month >= 0 && month < 12) {
      const currentMonth = this.months[idx];
      if (currentMonth !== undefined && currentMonth.getMonth() !== month) {
        return this.changeMonths(date => new Date(date.getFullYear(), month), idx);
      }
    }

    return this.months;
  }

  toYear(year: number, idx: number) {
    const currentMonth = this.months[idx];
    if ( currentMonth !== undefined && currentMonth.getFullYear() !== year) {
      return this.changeMonths(date => new Date(year, date.getMonth()), idx);
    }

    return this.months;
  }

  private changeMonths(mapFn: (date: Date) => Date, idx?: number) {
    return this.months.map( (d, i) =>
      idx === undefined || i === idx ? mapFn(d) : d
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

// TODO remove differ, force the usage of immutable Date and do a simple loop over new value should be enough here

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
