import { Output, EventEmitter, forwardRef, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DayDate } from '../utils';
import { DateConstraint } from '../constraint/dateconstraint.directive';

// TODO move out the validation part ? like a DateValidator directive instead of the Validator input

export abstract class DatepickerSelect<T> implements ControlValueAccessor {

  protected abstract get EMPTY_VALUE(): T

  private _value = this.EMPTY_VALUE;

  get value(): T {
    return this._value;
  }

  /**
   * Set the value without any check (except null) and emit an onDateChange event
   * @param {T} value
   */
  set value(value: T) {
     /* Use of a function so it can be overriden */
    this._setValue(value);
  }

  // TODO add an emitEvent parameter ? We would have to delete the setter
  protected _setValue(value: T) {
    if (value !== this._value) {
      this._value = value || this.EMPTY_VALUE;

      this.onChangeCallback(this._value);
      this.selectionChange.emit(this._value);
    }
  }

  @Output()
  selectionChange = new EventEmitter<T>();

  protected isDateValid: (date: DayDate) => boolean;

  constructor(protected dateConstraint: DateConstraint | null) {
    this.isDateValid = dateConstraint !== null ?
      (date: DayDate) => dateConstraint.isDateValid(date) :
      () => true;
  }

  /* Value accessor stuff */
  public onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: T) => void = () => { };

  // TODO should we check that the value match SelectDirective's expected value type ?
  // If so how ?
  // TODO use setValue() ?
  writeValue(value: T) {
    this.value = value;
  }

  registerOnChange(fn: (_: T) => void) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouchedCallback = fn;
  }
  /* */

  abstract setValue(value: T): void


  selectDate(date: DayDate): boolean {
    if (!date || !this.isDateValid(date))
      return false;

    if (this.unselectDate(date))
      return false;

    return this._selectDate(date);
  }

  unselectDate(date: DayDate): boolean {
    if (!this.isDateSelected(date))
      return false;

    return this._unselectDate(date);
  }

  protected abstract _selectDate(date: DayDate): boolean
  protected abstract _unselectDate(date: DayDate): boolean
  abstract isDateSelected(date: DayDate): boolean

  isDateInSelection(date: DayDate): boolean {
    return this.isDateSelected(date);
  }

  abstract isComplete(): boolean;
}

export function selectProviders(directiveClass: Function): Provider[] {
  return [
  { provide: DatepickerSelect, useExisting: forwardRef(() => directiveClass) },
  { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => directiveClass), multi: true }
  ];
}
