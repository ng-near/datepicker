import { EventEmitter, forwardRef, OnDestroy, Output, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { DayDate } from '../utils/utils';
import { DateConstraint, DateConstraintProvider } from '../validator/directives';

export interface EmitOptions {
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
}

export abstract class DatepickerSelect<T, R = void> implements ControlValueAccessor, OnDestroy {

  get value(): T {
    return this._value;
  }

  @Output()
  selectionChange = new EventEmitter<T>();

  protected isValid: (date: DayDate) => boolean = d => true;
  private sub: Subscription | undefined;

  constructor(private _value: T, dateConstraints: DateConstraint) {
    if (dateConstraints != null) {
      this.isValid = (date: DayDate) => dateConstraints.validate(date) === null;
      this.sub = dateConstraints.constraintChange.subscribe(() => this.updateValidity());
    }
  }

  /* Value accessor stuff */
  protected onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: T, emit?: boolean) => void = () => { };

  public writeValue(value: any) {
    // TODO assert/convert type ?
    this.setValue(value, {emitModelToViewChange: false});
  }

  public registerOnChange(fn: (_: T) => void) {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: () => void) {
    this.onTouchedCallback = fn;
  }
  /* */

  public setValue(value: T, options: EmitOptions = {}) {
    if (value !== this._value) {
      this._value = value

      if (options.emitModelToViewChange !== false) {
        this.onChangeCallback(value, options.emitViewToModelChange !== false);
      }

      if (options.emitEvent !== false) {
        this.selectionChange.emit(value);
      }
    }
  }

  public select(date: DayDate, extra?: R): void;
  /* we shouldn't select a null/undefined date so we don't exposed it on signature
   * but let's still handle it.
   */
  public select(date: DayDate | null | undefined, extra?: R) {
    if (date && this.isValid(date) &&
      (this.remove(date, extra) || this.add(date, extra))) {
      this.onTouchedCallback();
    }
  }

  public unselect(date: DayDate, extra?: R) {
    if (date && this.remove(date, extra)) {
      this.onTouchedCallback();
    }
  }

  public isInSelection(date: DayDate): boolean {
    return false;
  }

  protected abstract updateValidity(): void;

  /**
   * Add a date to the selection, that function can failed and not add the date.
   * @param date a valid and non-selected date (no need to redo the checks)
   * @param extra possible extra argument passed by selectDate.
   * @returns whether or not the date was effectively added.
   */
  protected abstract add(date: DayDate, extra?: R): boolean;

  /**
   * Try to remove a daily equivalent date from the selection.
   * If the date express the same day as a selected date, that date should be removed.
   * @param date to be removed from the selection if equivalent day is present.
   * @param extra possible extra argument passed by selectDate.
   * @returns whether or not the date was effectively removed.
   */
  protected abstract remove(date: DayDate, extra?: R): boolean;

  public abstract isSelected(date: DayDate): boolean;

  /**
   * @returns true if the selection is full.
   */
  public abstract isComplete(): boolean;

  public ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}

export function selectProviders(directiveClass: Function): Provider[] {
  return [
    DateConstraintProvider,
    { provide: DatepickerSelect, useExisting: forwardRef(() => directiveClass) },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => directiveClass), multi: true }
  ];
}
