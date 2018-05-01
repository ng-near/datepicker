import { EventEmitter, OnDestroy } from '@angular/core';

import { DateConstraint } from '../../src/validator/directives';
import { DateValidatorFn } from '../../src/validator/model';

let i = 0;
export function generateDay(id = i++) {
  return new Date(1970, 0, id);
}

export class MockConstraint implements DateConstraint, OnDestroy {

  constraintChange = new EventEmitter<void>();

  validate(_d: Date) {
    return null;
  }

  changeValidFn(validFn: DateValidatorFn) {
    this.validate = validFn;

    this.constraintChange.emit();
  }

  ngOnDestroy() { }
}
