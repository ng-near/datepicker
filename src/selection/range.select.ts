import { Directive, Input, Optional } from '@angular/core';

import { DayDate, isSameDay } from '../utils/utils';
import { DateConstraint } from '../validator/directives';
import { DatepickerSelect, EmitOptions, selectProviders } from './base.select';

export interface RangeDate {
  start?: DayDate | null | undefined;
  end?: DayDate | null | undefined;
}

/**
 * TODO docs
 * following convention null => invalid, undefined => empty/not set
 */

@Directive({
  selector: '[rangeSelect]',
  providers: selectProviders(RangeSelect)
})
export class RangeSelect extends DatepickerSelect<RangeDate, boolean> {

  // TODO input name and maybe function signature. Allow string for most common strategy ?
  @Input()
  detectStrategy: (value: RangeDate, selectedDate: DayDate) => boolean = ({start, end}, date) =>
    start != null && (end == null || Math.abs(date.getTime() - start.getTime()) > Math.abs(date.getTime() - end.getTime()))

  constructor(@Optional() dateConstraint: DateConstraint) {
    super({}, dateConstraint);
  }

  public setValue(range: RangeDate, options?: EmitOptions) {
    const { start, end } = range;

    if (start != null && end != null && start.getTime() > end.getTime()) {
      range = {start: end, end: start};
    }

    super.setValue(range, options);
  }


  public setDate(date: Date | null | undefined, setEnd = false, options?: EmitOptions) {
    if (setEnd === true) {
      this.setValue({...this.value, end: date}, options);
    } else {
      this.setValue({...this.value, start: date}, options);
    }
  }

  protected updateValidity() {
    let start = this.value.start;
    let end = this.value.end;

    if ( start != null && !this.isValid(start) ) {
      start = null;
    }

    if ( end != null && !this.isValid(end) ) {
      end = null;
    }

    if ( start !== this.value.start || end !== this.value.end ) {
      this.setValue({ start, end});
    }
  }

  selectStartDate(date: DayDate) {
    return this.select(date, true);
  }

  selectEndDate(date: DayDate) {
    return this.select(date, false);
  }

  protected add(date: DayDate, selectEnd?: boolean) {

    if (selectEnd == null) {
      // Auto detect which one to select
      selectEnd = this.detectStrategy(this.value, date);
    }

    this.setDate(date, selectEnd);
    return true;
  }

  protected remove(date: DayDate, selectEnd?: boolean) {
    //if (selectEnd == null || selectEnd === false)
    if (selectEnd !== true && isSameDay(date, this.value.start)) {
      this.setDate(undefined, false);
      return true;
    }

    if (selectEnd !== false && isSameDay(date, this.value.end)) {
      this.setDate(undefined, true);
      return true;
    }

    return false;
  }

  isSelected(date: DayDate) {
    return isSameDay(date, this.value.start) || isSameDay(date, this.value.end);
  }

  isInSelection(date: DayDate) {
    let start = this.value.start,
        end = this.value.end;
    return start != null && end != null &&
         date.getTime() >= start.getTime() &&
         date.getTime() <= end.getTime();
  }

  isComplete() {
    return this.value.start != null && this.value.end != null;
  }
}

