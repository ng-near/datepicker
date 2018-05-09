import { DateConstraint } from '../../../src/validator/directives';
import { DateValidator } from '../../../src/validator/model';

const TOGGLE_VALIDATOR_ERROR = {toggleValidator: true};

class ToggleValidator implements DateValidator {
  private valid = true;

  private fakeValidate() {
    return this.valid ? null : TOGGLE_VALIDATOR_ERROR;
  }

  validateDate(date: Date) {
    return this.fakeValidate();
  }

  validate(): { [key: string]: any; } {
    return this.fakeValidate();
  }

  private onChange = () => {};

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

  toggle() {
    this.valid = !this.valid;
    this.onChange();
  }
}

describe('DateConstraint', () => {
  let validator: ToggleValidator;
  let dateConstraint: DateConstraint;

  let changeSpy: jasmine.Spy;

  beforeEach(() => {
    validator = new ToggleValidator();

    dateConstraint = new DateConstraint([validator]);

    changeSpy = spyOn(dateConstraint.constraintChange, 'emit');
  })

  fit('should validate date according to validator', () => {
    expect(dateConstraint.validate(new Date())).toBe(null);
  })

  it('should emit and update validation when a validator changes', () => {
    validator.toggle();

    expect(changeSpy).toHaveBeenCalled();
    expect(dateConstraint.validate(new Date())).toBe(TOGGLE_VALIDATOR_ERROR);
  })
})
