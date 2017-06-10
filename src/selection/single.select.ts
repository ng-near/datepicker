import { Directive, OnChanges, SimpleChanges, Optional } from '@angular/core';

import { DatepickerSelect, selectProviders } from './base.select';
import { DayDate, isSameDay } from '../utils';
import { DateConstraint } from '../constraint/dateconstraint.directive';

@Directive({
  selector: '[singleSelect]',
  providers: selectProviders(SingleSelect)
})
export class SingleSelect extends DatepickerSelect<DayDate | null> implements OnChanges {

  protected get EMPTY_VALUE(){ return null; };

  setValue(value: DayDate) {
    if ( !value || this.isDateValid(value) )
      this._setValue(value);
  }

  constructor(@Optional() dateConstraint: DateConstraint) {
    super(dateConstraint);
  }

  ngOnChanges(changes: SimpleChanges) {
   if ( this.value !== null && !this.isDateValid(this.value) )
      this._setValue(null);
  }

  _selectDate(date: DayDate) {
    this._setValue(date);
    return true;
  }

  _unselectDate(date: DayDate) {
    this._setValue(null);
    return true;
  }

  isDateSelected(date: DayDate): boolean {
    return isSameDay(date, this.value);
  }

  isComplete(): boolean {
    return !!this.value;
  }
}

