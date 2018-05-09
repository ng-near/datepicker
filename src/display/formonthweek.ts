import { Directive, EmbeddedViewRef, Input, NgModule, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

import { DAY_MILLIS, DayDate, isSameDay, isSameMonth, newMonthDate } from '../utils/utils';

export interface ForMonthDayContext {
  $implicit: DayDate,
  today: boolean,
  currentMonth: boolean
}

// 2032 is good year for test (1 January is thursday + leap year)

@Directive({
  selector: '[forMonthweek][forMonthweekOf]'
})
export class ForMonthweek implements OnChanges {
  @Input('forMonthweekOf') month: Date;

  @Input('forMonthweekSixWeeks') sixWeeks = false;

  today: any;

  constructor (private template: TemplateRef<ForMonthDayContext>, private viewContainer: ViewContainerRef) { }

  ngOnChanges(changes: SimpleChanges) {
    // TODO if ('sixWeek' on changes) only add what's missing
    const { month } = changes;
    if ( this.month &&
          ((month && month.currentValue && (!month.previousValue || !isSameMonth(month.currentValue, month.previousValue))) ||
          'sixWeeks' in changes )
        )
      this.buildWeeks();
  }

  private buildWeeks() {
    //start date
    const startMonth = newMonthDate(this.month.getTime());
    const startMonthMillis = startMonth.getTime();





  }

  // TODO must be a way to optimize how we compute isToday
  private addDay(index: number, date: DayDate, currentMonth: boolean) {
    const today = isSameDay(date, this.today.value);

    const view = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(index);
    if (view) {
      view.context.$implicit = date;
      view.context.today = today;
      view.context.currentMonth = currentMonth;
    }
    else
      this.viewContainer.createEmbeddedView(this.template, {
        $implicit: date,
        today, currentMonth
      })
  }

  private clearExtraDays(nbDays: number) {
    for (let i = nbDays, l = this.viewContainer.length; i < l; i++)
      this.viewContainer.remove(i);
  }

  private updateToday() {
    const firstDay = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(0);
    if (firstDay === null)
      return;

    const todayIdx = (this.today.value.getTime() - firstDay.context.$implicit.getTime()) / DAY_MILLIS;

    const todayView = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(todayIdx);
    if (todayView !== null)
      todayView.context.today = true;

    // We assume last today was yesterday so we reset its `isToday` value
    const yesterdayView = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(todayIdx - 1);
    if (yesterdayView !== null)
      yesterdayView.context.today = false;
  }
}


@NgModule({
  declarations: [ ForMonthweek ]
})
export class ShutupModule { }
