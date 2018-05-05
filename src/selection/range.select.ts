import { Directive, Input, OnChanges, Optional, SimpleChanges } from '@angular/core';

import { DayDate, isSameDay } from '../utils/utils';
import { DateConstraint } from '../validator/directives';
import { DatepickerSelect, EmitOptions, selectProviders } from './base.select';

export interface RangeDate {
  start?: DayDate | null | undefined;
  end?: DayDate | null | undefined;
}

export const enum RangeSelectType {
  NONE = 0,
  START_DATE = 1,
  END_DATE = 2,
  BOTH_DATES = START_DATE | END_DATE,
}

export type DetectStrategyFn = (value: RangeDate, selectedDate: DayDate) => RangeSelectType;

/**
 * TODO docs
 * following convention null => invalid, undefined => empty/not set
 */

@Directive({
  selector: '[rangeSelect]',
  providers: selectProviders(RangeSelect)
})
export class RangeSelect extends DatepickerSelect<RangeDate, RangeSelectType> implements OnChanges {

  // single function with a select/deselect boolean instead of 2 functions ?
  // is unselectStrategy really useful ?
  // Allow string for most common strategy ?
  @Input()
  selectStrategy: DetectStrategyFn = ({start, end}, date) => {
    if (start == null && end == null) {
      return RangeSelectType.BOTH_DATES;
    }

    return start == null || (end != null && Math.abs(date.getTime() - start.getTime()) < Math.abs(date.getTime() - end.getTime())) ?
        RangeSelectType.START_DATE :
        RangeSelectType.END_DATE
    ;
  };

  @Input()
  unselectStrategy: DetectStrategyFn = (value: RangeDate, unselectedDate: DayDate) => RangeSelectType.BOTH_DATES;

  @Input()
  openRange = false;

  constructor(@Optional() dateConstraint: DateConstraint) {
    super({}, dateConstraint);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('openRange' in changes) {
      this.selectionChange.emit(this.value);
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
  private _setDate(predicate: (d: DayDate | null | undefined) => boolean, date: DayDate | null | undefined, setType: RangeSelectType, options?: EmitOptions) {
    if (setType !== RangeSelectType.NONE) {
      let {start, end} = this.value;

      if ((setType & RangeSelectType.START_DATE) > 0 && predicate(start)) {
        start = date;
      }

      if ((setType & RangeSelectType.END_DATE) > 0 && predicate(end)) {
        end = date;
      }

      if (start !== this.value.start || end !== this.value.end) {
        this.setValue({start, end}, options);
        return true;
      }
    }

    return false;
  }

  public setDate(date: DayDate | null | undefined, setType: RangeSelectType, options?: EmitOptions) {
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
  selectStartDate(date: DayDate) {
    return this.select(date, RangeSelectType.START_DATE);
  }
  selectEndDate(date: DayDate) {
    return this.select(date, RangeSelectType.END_DATE);
  }

  protected add(date: DayDate, selectType = this.selectStrategy(this.value, date)) {
    return this.setDate(date, selectType);
  }

  protected remove(date: DayDate, deselectType = this.unselectStrategy(this.value, date)) {
    return this._setDate(d => isSameDay(d, date), undefined, deselectType);
  }

  isSelected(date: DayDate) {
    return isSameDay(date, this.value.start) || isSameDay(date, this.value.end);
  }

  isInSelection(date: DayDate) {
    const { start, end } = this.value;

    const afterStart = start != null ? date.getTime() >= start.getTime() : this.openRange;
    const beforeEnd = end != null ? date.getTime() <= end.getTime() : this.openRange;

    return afterStart && beforeEnd;
  }

  isComplete() {
    return this.value.start != null && this.value.end != null;
  }
}

