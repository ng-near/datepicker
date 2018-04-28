import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { DayDate } from '../utils/utils';
import { DateConstraintFn } from './constraints';

@Directive({
  selector: '[dateConstraint]'
})
export class DateConstraint {

  private _constraints: DateConstraintFn[] = [];

  @Input('dateConstraint')
  set constraints(constraint: DateConstraintFn | DateConstraintFn[]) {
    this._constraints = !constraint ? [] :
      Array.isArray(constraint) ? constraint : [constraint];

    this.constraintChange.emit(this._constraints);
  }

  // We only need an observable for internal use but why not make it an Ouput
  @Output() constraintChange = new EventEmitter<DateConstraintFn[]>();

  isDateValid(date: DayDate): boolean {
    const res = this._constraints.reduce( (errors, validate) => ({
      ...errors,
      ...validate(date)
    }), {});

    return Object.keys(res).length === 0;
  }
}
