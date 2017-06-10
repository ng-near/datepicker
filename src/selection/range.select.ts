import { Directive, OnChanges, SimpleChanges, Optional } from '@angular/core';

import { DatepickerSelect, selectProviders } from './base.select';
import { DayDate, isSameDay } from '../utils';
import { DateConstraint } from '../constraint/dateconstraint.directive';

export interface RangeDate {
  start: DayDate | null;
  end: DayDate | null;
}

@Directive({
  selector: '[rangeSelect]',
  providers: selectProviders(RangeSelect)
})
export class RangeSelect extends DatepickerSelect<RangeDate> implements OnChanges {

  protected get EMPTY_VALUE(): RangeDate {
    return {
        start: null,
        end: null
      };
  };

  constructor(@Optional() dateConstraint: DateConstraint) {
    super(dateConstraint);
  }

  setValue(value: RangeDate) {
    if (!value)
      this.value = this.EMPTY_VALUE;
    else if ( value !== this.value) {
      if ( value.start !== null && !this.isDateValid(value.start) )
        value.start = null;

      if ( value.end !== null && !this.isDateValid(value.end) )
        value.end = null;

      this.value = value;
    }
  }

  setStartDate(date: DayDate | null) {
    this.value = {
      start: date, //clone ?
      end: this.value.end
    };
  }

  setEndDate(date: DayDate | null) {
    this.value = {
      start: this.value.start,
      end: date //clone ?
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    let start = this.value.start,
       end = this.value.end;

    if ( this.value.start !== null && !this.isDateValid(this.value.start) )
      start = null;

    if ( this.value.end !== null && !this.isDateValid(this.value.end) )
      end = null;

    if ( start !== this.value.start || end !== this.value.end )
      this.value = {
        start: start,
        end: end
      };
  }

  _selectDate(date: DayDate): boolean {
    let start = this.value.start,
        end = this.value.end;

    if (!start)
      start = date;
    else if (!end)
      end = date;
    else {
      if (Math.abs(date.getTime() - start.getTime()) <= Math.abs(date.getTime() - end.getTime()))
        this.setStartDate(date);
      else
        this.setEndDate(date);

      return true;
    }

    if (start && end && start.getTime() > end.getTime()) {
      this.value = {
        start: end,
        end: start
      };
    }
    else
      this.value = {
        start: start,
        end: end
      }

    return true;
  }

  _unselectDate(date: DayDate): boolean {
    if (this.value.start !== null && isSameDay(date, this.value.start)) {
      this.setStartDate(null);
      return true;
    }

    if (this.value.end !== null && isSameDay(date, this.value.end)) {
      this.setEndDate(null);
      return true;
    }

    return false;
  }

  isDateSelected(date: DayDate): boolean {
    return date && (isSameDay(date, this.value.start) || isSameDay(date, this.value.end));
  }

  isDateInSelection(date: DayDate): boolean {
    let start = this.value.start,
        end = this.value.end;
    return start !== null && end !== null &&
         date.getTime() >= start.getTime() &&
         date.getTime() <= end.getTime();
  }

  isComplete(): boolean {
    return !!this.value.start && !!this.value.end;
  }
}

