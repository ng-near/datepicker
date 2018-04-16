import { Directive, forwardRef, Optional } from '@angular/core';

import { DateConstraint } from '../constraint/dateconstraint.directive';
import { DayDate, isSameDay } from '../utils';
import { DatepickerSelect } from './base.select';

@Directive({
  selector: '[singleSelect]',
  providers: [
    { provide: DatepickerSelect, useExisting: forwardRef(() => SingleSelect) }
  ]
})
export class SingleSelect extends DatepickerSelect<DayDate | null> {

  protected get EMPTY_VALUE() { return null; };

  setValue(value: DayDate) {
    if ( !value || this.isDateValid(value) )
      this.value = value;
  }

  constructor(@Optional() dateConstraint: DateConstraint) {
    super(dateConstraint);
  }

  _selectDate(date: DayDate) {
    this.value = date;
    return true;
  }

  _unselectDate(date: DayDate) {
    this.value = null;
    return true;
  }

  isDateSelected(date: DayDate): boolean {
    return isSameDay(date, this.value);
  }

  updateValidity() {
    if (this.value !== null && !this.isDateValid(this.value)) {
      this.value = null;
    }
  }

  isComplete(): boolean {
    return !!this.value;
  }
}

