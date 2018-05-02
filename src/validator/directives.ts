import { Directive, EventEmitter, FactoryProvider, Inject, Injectable, InjectionToken, LOCALE_ID, OnChanges, OnDestroy, Optional, Type } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';

import { DATE_CONSTRAINT, DATE_CONVERTER, DateConverterFn, DateValidator, DateValidatorFn } from './model';
import { DateValidators } from './validators';

// helpers
export function provideMulti(token: InjectionToken<DateValidator>, directive: Type<DateValidator>) {
  return {
    provide: token,
    multi: true,
    useExisting: directive,
  };
}

export function provideValidator(directive: Type<DateValidator>) {
  return provideMulti(NG_VALIDATORS, directive);
}

export function provideConstraint(directive: Type<DateValidator>) {
  return provideMulti(DATE_CONSTRAINT, directive);
}

function NullValidator() { return null; }

// base class
export abstract class AbstractDateValidator implements DateValidator, OnChanges {

  protected onChange = () => {};

  constructor(@Inject(DATE_CONVERTER) private dateConverter: DateConverterFn) { }

  ngOnChanges() {
    this.onChange();
  }

  validateDate: DateValidatorFn = NullValidator;

  validate(control: AbstractControl) {
    if (this.validateDate == null) {
      return null;
    }

    const date = this.dateConverter(control.value);

    if (date == null) {
      // TODO throw on dev, shouldn't happen it's resilient code.
      return { invalidDate: `unable to convert ${control.value} into a date` };
    }

    return this.validateDate(date);
  }

  registerOnValidatorChange(onchange: () => void) {
    this.onChange = onchange;
  }
}

function normalizeInput<T>(validatorFactory: (arg: T) => DateValidatorFn, arg: T | null | undefined) {
  return arg == null ? NullValidator : validatorFactory(arg);
}

/*-- Min Date -- */
export abstract class AbstractMinDate extends AbstractDateValidator {

  set minDate(date: Date) {
    this.validateDate = normalizeInput(DateValidators.minDate, date);
  }
}

@Directive({
  selector: '[minDateValidator]',
  inputs: ['minDateValidator:minDate'],
  providers: [provideValidator(MinDateValidator)]
})
export class MinDateValidator extends AbstractMinDate { }

@Directive({
  selector: '[minDateConstraint]',
  inputs: ['minDateConstraint:minDate'],
  providers: [provideConstraint(MinDateConstraint)]
})
export class MinDateConstraint extends AbstractMinDate { }

@Directive({
  selector: '[minDate]',
  inputs: ['minDate'],
  providers: [provideValidator(MinDate), provideConstraint(MinDate)],
})
export class MinDate extends AbstractMinDate { }

/* -- Max Date -- */
export abstract class AbstractMaxDate extends AbstractDateValidator {

  set maxDate(date: Date) {
    this.validateDate = normalizeInput(DateValidators.maxDate, date);
  }
}

@Directive({
  selector: '[maxDateValidator]',
  inputs: ['maxDateValidator:maxDate'],
  providers: [provideValidator(MaxDateValidator)]
})
export class MaxDateValidator extends AbstractMaxDate { }

@Directive({
  selector: '[maxDateConstraint]',
  inputs: ['maxDateConstraint:maxDate'],
  providers: [provideConstraint(MaxDateConstraint)]
})
export class MaxDateConstraint extends AbstractMaxDate { }

@Directive({
  selector: '[maxDate]',
  inputs: ['maxDate'],
  providers: [provideValidator(MaxDate), provideConstraint(MaxDate)],
})
export class MaxDate extends AbstractMaxDate { }

/* -- Disabled Dates -- */
export abstract class AbstractDisabledDates extends AbstractDateValidator {

  set disabledDates(dates: Date[]) {
    this.validateDate = normalizeInput(DateValidators.disabledDates, dates);
  }
}

@Directive({
  selector: '[disabledDatesValidator]',
  inputs: ['disabledDatesValidator:disabledDates'],
  providers: [provideValidator(DisabledDatesValidator)],
})
export class DisabledDatesValidator extends AbstractDisabledDates { }

@Directive({
  selector: '[disabledDatesConstraint]',
  inputs: ['disabledDatesConstraint:disabledDates'],
  providers: [provideConstraint(DisabledDatesConstraint)],
})
export class DisabledDatesConstraint extends AbstractDisabledDates { }

@Directive({
  selector: '[disabledDates]',
  inputs: ['disabledDates'],
  providers: [provideValidator(DisabledDates), provideConstraint(DisabledDates)],
})
export class DisabledDates extends AbstractDisabledDates { }

/* -- Not Week-end -- */
export abstract class AbstractNotWeekend extends AbstractDateValidator {

  set notWeekend(locale: string) {
    this.setValidator(locale || this.locale);
  }

  constructor(@Inject(LOCALE_ID) private locale: string, @Inject(DATE_CONVERTER) dateConverter: DateConverterFn) {
    super(dateConverter);

    this.setValidator(locale);
  }

  private setValidator(locale: string) {
    this.validateDate = DateValidators.notWeekend(locale);
  }
}

@Directive({
  selector: '[notWeekendValidator]',
  inputs: ['notWeekendValidator:notWeekend'],
  providers: [provideValidator(NotWeekendDateValidator), provideConstraint(NotWeekendDateValidator)],
})
export class NotWeekendDateValidator extends AbstractNotWeekend { }

@Directive({
  selector: '[notWeekendConstraint]',
  inputs: ['notWeekendConstraint:notWeekend'],
  providers: [provideValidator(NotWeekendDateConstraint), provideConstraint(NotWeekendDateConstraint)],
})
export class NotWeekendDateConstraint extends AbstractNotWeekend { }

@Directive({
  selector: '[notWeekend]',
  inputs: ['notWeekend'],
  providers: [provideValidator(NotWeekendDate), provideConstraint(NotWeekendDate)],
})
export class NotWeekendDate extends AbstractNotWeekend { }

/* -- Composed Constraint -- */
@Injectable()
export class DateConstraint implements OnDestroy {
  validate: DateValidatorFn = () => null;

  constraintChange = new EventEmitter<void>();

  constructor(validators: DateValidator[]) {
    this.validate = DateValidators.compose(validators.map(v => v.validateDate));

    const onChange = () => this.constraintChange.emit();

    validators.forEach(v => {
      if (v.registerOnValidatorChange !== undefined) {
        v.registerOnValidatorChange(onChange)
      }
    });
  }

  ngOnDestroy() {
    this.constraintChange.complete();
  }
}

export function DateConstraintFactory(validators: DateValidator[]) {
  return validators == null || validators.length === 0 ? null : new DateConstraint(validators);
}

export const DateConstraintProvider: FactoryProvider = {
  provide: DateConstraint,
  deps: [[new Optional(), DATE_CONSTRAINT]],
  useFactory: DateConstraintFactory,
}

export const VALIDATOR_DIRECTIVES = [
  MinDateValidator,
  MinDateConstraint,
  MinDate,

  MaxDateValidator,
  MaxDateConstraint,
  MaxDate,

  DisabledDatesValidator,
  DisabledDatesConstraint,
  DisabledDates,

  NotWeekendDateValidator,
  NotWeekendDateConstraint,
  NotWeekendDate,
]
