import { Directive, Input, OnChanges, SimpleChanges, Optional } from '@angular/core';

import { DatepickerSelect, selectProviders } from './base.select';
import { newDayDate, DayDate, isSameDay } from '../utils';
import { DateConstraint } from '../constraint/dateconstraint.directive';

@Directive({
  selector: '[multiSelect]',
  providers: selectProviders(MultiSelect)
})
export class MultiSelect extends DatepickerSelect<DayDate[]> implements OnChanges {

  protected get EMPTY_VALUE() {
    return [];
  }

  private _limit = Infinity;

  @Input('multiSelect')
  get limit() {
    return this._limit;
  }

  set limit(limit: number) {
    this._limit = limit;
  }

  constructor(@Optional() dateConstraint: DateConstraint) {
    super(dateConstraint);
  }

  public setValue(dates: DayDate[]) {
    if (dates != this.value) {
      this.value = (dates || [])
      .filter( d => this.isDateValid(d) )
      //TODO TEST : be sure all js engine does not remove any element on
      //  splice(0, -Infinity);
      .splice(0, dates.length - this.limit)
      .map( d => newDayDate(d.getTime()) )
      .sort( (a, b) => <any>a - <any>b );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    let value = this.value;

    if ('validator' in changes) {
      let newValue = value.filter( d => this.isDateValid(d) );
      if (newValue.length < value.length)
        value = newValue;
    }

    if ('limit' in changes && value.length > this.limit)
      value = value.slice(0, this.limit);

    this.value = value;
  }

  _selectDate(date: DayDate): boolean {
    if (this.isComplete())
      return false;

    this.value = [...this.value, date]
      .sort( (a, b) => a.getTime() - b.getTime());
    return true;
  }

  unselectDate(date: DayDate): boolean {
    let newValue = this.value.filter( d => !isSameDay(d, date) );
    if (newValue.length < this.value.length) {
      this.value = newValue;
      return true;
    }

    return false;
  }

  /* unused */
  _unselectDate(date: DayDate): boolean { return false; }

  isDateSelected(date: DayDate): boolean {
    return !!this.value.find( d => isSameDay(d, date) );
  }

  isComplete(): boolean {
    return this.value && this.value.length == this.limit;
  }
}
