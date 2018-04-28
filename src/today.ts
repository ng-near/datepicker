import { InjectionToken, Optional, Provider, SkipSelf } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { timer } from 'rxjs/observable/timer';
import { mapTo } from 'rxjs/operator/mapTo';

import { DAY_MILLIS, DayDate, newDayDate } from './utils/utils';

export const TODAY = new InjectionToken<BehaviorSubject<DayDate>>('today');

export function todayProvider(present?: BehaviorSubject<DayDate>) {
  if (present !== null) return present;

  const today = newDayDate();
  const subject = new BehaviorSubject(today);

  // TODO how do we test that ?
  mapTo.call(
    timer(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), DAY_MILLIS),
    () => newDayDate()
  ).subscribe(subject);

  return subject;
}

export const TodayProvider: Provider = {
  provide: TODAY,
  useFactory: todayProvider,
  deps: [[new Optional, new SkipSelf, TODAY]]
};
