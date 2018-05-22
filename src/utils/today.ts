import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { timer } from 'rxjs/observable/timer';
import { map, shareReplay, startWith } from 'rxjs/operators';

import { DAY_MILLIS, ensureDayDate } from './utils';

@Injectable()
export class Today {
  // TODO how do we test that ?
  observable: Observable<Date> = defer(() => {
    const now = new Date();

    return timer(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), DAY_MILLIS)
      .pipe(
        map(() => ensureDayDate()),
        startWith(now),
      )
  }).pipe(
    shareReplay(1),
  )

  get date() {
    return ensureDayDate();
  }
}

