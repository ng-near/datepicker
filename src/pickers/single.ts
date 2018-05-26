import { Directive, Optional } from '@angular/core';

import { DayDate, isSameDay } from '../utils/utils';
import { DateConstraint } from '../validator/directives';
import { DatePicker, pickerProviders } from './base';

/**
 * TODO docs
 * following convention null => invalid, undefined => empty/not set
 */

@Directive({
  selector: '[singlePicker]',
  exportAs: 'picker, singlePicker',
  providers: pickerProviders(SinglePicker),
})
export class SinglePicker extends DatePicker<DayDate | null | undefined> {

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

  isPicked(date: DayDate): boolean {
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

