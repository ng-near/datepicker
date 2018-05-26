import { Directive, Input, OnChanges, Optional, SimpleChanges } from '@angular/core';

import { DayDate, isSameDay } from '../utils/utils';
import { DateConstraint } from '../validator/directives';
import { DatePicker, EmitOptions, pickerProviders } from './base';

export interface RangeDate {
  start?: DayDate | null | undefined;
  end?: DayDate | null | undefined;
}

export const enum RangePickerType {
  NONE = 0,
  START_DATE = 1,
  END_DATE = 2,
  BOTH_DATES = START_DATE | END_DATE,
}

export type DetectStrategyFn = (value: RangeDate, pickedDate: DayDate) => RangePickerType;

/**
 * TODO docs
 * following convention null => invalid, undefined => empty/not set
 */

@Directive({
  selector: '[rangePicker]',
  exportAs: 'picker, rangePicker',
  providers: pickerProviders(RangePicker)
})
export class RangePicker extends DatePicker<RangeDate, RangePickerType> implements OnChanges {

  // single function with a pick/unpick boolean instead of 2 functions ?
  // is unpickStrategy really useful ?
  // Allow string for most common strategy ?
  @Input()
  pickStrategy: DetectStrategyFn = ({start, end}, date) => {
    if (start == null && end == null) {
      return RangePickerType.BOTH_DATES;
    }

    return start == null || (end != null && Math.abs(date.getTime() - start.getTime()) < Math.abs(date.getTime() - end.getTime())) ?
      RangePickerType.START_DATE :
      RangePickerType.END_DATE
    ;
  };

  @Input()
  unpickStrategy: DetectStrategyFn = (value: RangeDate, unpickedDate: DayDate) => RangePickerType.BOTH_DATES;

  @Input()
  openRange = false;

  constructor(@Optional() dateConstraint: DateConstraint) {
    super({}, dateConstraint);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('openRange' in changes) {
      this.pickChange.emit(this.value);
    }
  }

  public setValue(range: RangeDate, options?: EmitOptions) {
    const { start, end } = range;

    if (start != null && end != null && start.getTime() > end.getTime()) {
      range = {start: end, end: start};
    }

    super.setValue(range, options);
  }

  /**
   * Utility function because setDate() and remove() were really close code.
   * @param predicate return true if date should be set.
   * @param date
   * @param setType
   * @param options
   */
  private _setDate(predicate: (d: DayDate | null | undefined) => boolean, date: DayDate | null | undefined, setType: RangePickerType, options?: EmitOptions) {
    if (setType !== RangePickerType.NONE) {
      let {start, end} = this.value;

      if ((setType & RangePickerType.START_DATE) > 0 && predicate(start)) {
        start = date;
      }

      if ((setType & RangePickerType.END_DATE) > 0 && predicate(end)) {
        end = date;
      }

      if (start !== this.value.start || end !== this.value.end) {
        this.setValue({start, end}, options);
        return true;
      }
    }

    return false;
  }

  public setDate(date: DayDate | null | undefined, setType: RangePickerType, options?: EmitOptions) {
    return this._setDate(d => !isSameDay(d, date), date, setType, options);
  }

  protected updateValidity() {
    let { start, end } = this.value;

    if (start != null && !this.isValid(start)) {
      start = null;
    }

    if (end != null && !this.isValid(end)) {
      end = null;
    }

    if ( start !== this.value.start || end !== this.value.end ) {
      this.setValue({ start, end});
    }
  }

  /* alias function for easy use inside template (no enum ref)*/
  pickStartDate(date: DayDate) {
    return this.pick(date, RangePickerType.START_DATE);
  }
  pickEndDate(date: DayDate) {
    return this.pick(date, RangePickerType.END_DATE);
  }

  protected add(date: DayDate, pickType = this.pickStrategy(this.value, date)) {
    return this.setDate(date, pickType);
  }

  protected remove(date: DayDate, unpickType = this.unpickStrategy(this.value, date)) {
    return this._setDate(d => isSameDay(d, date), undefined, unpickType);
  }

  isPicked(date: DayDate) {
    return isSameDay(date, this.value.start) || isSameDay(date, this.value.end);
  }

  isInPick(date: DayDate) {
    const { start, end } = this.value;

    const afterStart = start != null ? date.getTime() >= start.getTime() : this.openRange && end != null;
    const beforeEnd = end != null ? date.getTime() <= end.getTime() : this.openRange && start != null;

    return afterStart && beforeEnd;
  }

  isComplete() {
    return this.value.start != null && this.value.end != null;
  }
}

