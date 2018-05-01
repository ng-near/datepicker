import { Directive, forwardRef, Optional } from '@angular/core';

import { DayDate, isSameDay } from '../utils/utils';
import { DateConstraint } from '../validator/directives';
import { DatepickerSelect } from './base.select';

/**
 * TODO docs
 * following convention null => invalid, undefined => empty/not set
 */

@Directive({
  selector: '[singleSelect]',
  providers: [
    { provide: DatepickerSelect, useExisting: forwardRef(() => SingleSelect) }
  ]
})
export class SingleSelect extends DatepickerSelect<DayDate | null | undefined> {

  constructor(@Optional() dateConstraint: DateConstraint) {
    super(undefined, dateConstraint);
  }

  protected add(date: DayDate) {
    this.setValue(date);
    return true;
  }

  protected remove(date: DayDate) {
    if (isSameDay(date, this.value)) {
      this.setValue(undefined);
      return true;
    }

    return false;
  }

  isSelected(date: DayDate): boolean {
    return isSameDay(date, this.value);
  }

  protected updateValidity() {
    if (this.value != null && !this.isValid(this.value)) {
      this.setValue(null);
    }
  }

  isComplete(): boolean {
    return !!this.value;
  }
}

