import { EventEmitter } from '@angular/core';

import { DateConstraint } from '../../../src/constraint/dateconstraint.directive';

let i = 0;
export function generateDay(id = i++) {
  return new Date(1970, 0, id);
}

class MockConstraintImpl {

  constraintChange = new EventEmitter();

  isDateValid(_d: Date) {
    return true;
  }

  changeValidFn(validFn: (date: Date) => boolean) {
    this.isDateValid = validFn;

    this.constraintChange.emit();
  }
}

export interface MockConstraint extends DateConstraint {
  changeValidFn: (validFn: (date: Date) => boolean) => void;
}

export function newMockConstraint(): MockConstraint {
  return new MockConstraintImpl() as any;
}
