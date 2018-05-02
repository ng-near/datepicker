import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { timer } from 'rxjs/observable/timer';
import { map, shareReplay, startWith } from 'rxjs/operators';

import { DAY_MILLIS, newDayDate } from './utils';


@Injectable()
export class Today {
  // TODO how do we test that ?
  observable: Observable<Date> = defer(() => {
    const now = newDayDate();
    return timer(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), DAY_MILLIS)
      .pipe(
        map(() => newDayDate()),
        startWith(now),
      )
  }).pipe(
    shareReplay(1),
  )

  get date() {
    return newDayDate();
  }
}

