import { Directive, EmbeddedViewRef, Input, OnChanges, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Today } from '../utils/today';
import { DAY_MILLIS, DayDate, isSameDay, newDayDate, newMonthDate, WEEK_MILLIS } from '../utils/utils';

export interface ForMonthDayContext {
  $implicit: DayDate,
  today: boolean,
  currentMonth: boolean
}

@Directive({
  selector: '[forMonthday][forMonthdayOf]'
})
export class ForMonthday implements OnChanges, OnDestroy {
  @Input('forMonthdayOf') month: Date;

  @Input('forMonthdaySixWeeks') sixWeeks = false;

  private sub = Subscription.EMPTY;

  constructor (private today: Today, private template: TemplateRef<ForMonthDayContext>, private viewContainer: ViewContainerRef) {
    this.sub = today.observable.subscribe(d => { this.updateToday(d) });
  }

  ngOnChanges() {
    // TODO if ('sixWeek' on changes) only add what's missing
    this.buildDays();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // TODO custom first day of week
  private buildDays() {
    //start date
    const startMonth = newMonthDate(this.month.getTime());
    const startMonthMillis = startMonth.getTime();
    let index = 0;

    /* Days of previous month */
    const firstWeekDay = startMonth.getDay();
    const nbDaysPrevMonth = firstWeekDay == 0 ? 6 : firstWeekDay - 1;
    const firstDayInMillis = startMonthMillis - nbDaysPrevMonth * DAY_MILLIS;

    for (let time = firstDayInMillis;
         index < nbDaysPrevMonth;
         time += DAY_MILLIS, index++)
      this.addDay(index, new Date(time), false);

    /* Days of current month */
    const endMonth = newDayDate();
    endMonth.setFullYear(this.month.getFullYear(), this.month.getMonth() + 1, 0);
    const endMonthMillis = endMonth.getTime();

    for ( const itDate = new Date(startMonthMillis); itDate.getTime() <= endMonthMillis; itDate.setDate(itDate.getDate() + 1) )
      this.addDay(index++, new Date(itDate.getTime()), true);

    /* Days of next month */
    const lastWeekDay = endMonth.getDay();
    const endDate = new Date(endMonthMillis);
    if (lastWeekDay > 0)
      endDate.setDate( endDate.getDate() + 7 - endDate.getDay());

    if (this.sixWeeks) {
      const nbWeeks = Math.ceil( (endDate.getTime() - firstDayInMillis) / WEEK_MILLIS );
      if ( nbWeeks < 6 )
        endDate.setTime( endDate.getTime() + (6 - nbWeeks) * WEEK_MILLIS);
    }

    for (let time = endMonthMillis + DAY_MILLIS, endDateMillis = endDate.getTime(); time <= endDateMillis; time += DAY_MILLIS )
      this.addDay(index++, new Date(time), false);

    if (!this.sixWeeks)
      // clear extra days if month is smaller than preceding
      this.clearExtraDays(index);
  }

  // TODO must be a way to optimize how we compute isToday
  private addDay(index: number, date: DayDate, currentMonth: boolean) {
    const today = isSameDay(date, this.today.date);

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

  private updateToday(today: Date) {
    const firstDay = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(0);
    if (firstDay === null)
      return;

    const todayIdx = (today.getTime() - firstDay.context.$implicit.getTime()) / DAY_MILLIS;

    const todayView = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(todayIdx);
    if (todayView !== null)
      todayView.context.today = true;

    // We assume last today was yesterday so we reset its `isToday` value
    const yesterdayView = <EmbeddedViewRef<ForMonthDayContext>>this.viewContainer.get(todayIdx - 1);
    if (yesterdayView !== null)
      yesterdayView.context.today = false;
  }
}
