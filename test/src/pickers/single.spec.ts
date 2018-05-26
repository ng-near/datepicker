import { SinglePicker } from '../../../src/pickers/single';
import { generateDay, MockConstraint } from '../test.utils';

describe('Singlepick', () => {
  let constraint: MockConstraint;
  let picker: SinglePicker;

  beforeEach(() => {
    constraint = new MockConstraint();
    picker = new SinglePicker(constraint);
  })

  it('should pick a date', () => {
    const value = generateDay();

    picker.pick(value);

    expect(picker.value).toBe(value);
  })

  it('should replace a date', () => {
    picker.pick(generateDay());

    const value = generateDay();
    picker.pick(value);

    expect(picker.value).toBe(value);
  })

  it('should remove the date if it\'s already picked', () => {
    const value = generateDay();
    picker.pick(value);

    picker.pick(value);

    expect(picker.value).toBe(undefined);
  })

  it('should remove an already picked date', () => {
    const value = generateDay();

    picker.pick(value);
    picker.unpick(value);

    expect(picker.value).toBe(undefined);
  })

  it('should not remove a not already picked date', () => {
    const value = generateDay();
    picker.pick(value);

    picker.unpick(generateDay());

    expect(picker.value).toBe(value);
  })

  it('should return true if date is picked', () => {
    const value = generateDay();
    picker.pick(value);

    expect(picker.isPicked(value)).toBe(true);
  })

  it('should return false if date is not picked', () => {
    const value = generateDay();
    picker.pick(value);

    expect(picker.isPicked(generateDay()));
  })

  it('should be complete when date is set', () => {
    const value = generateDay();
    picker.pick(value);

    expect(picker.isComplete()).toBe(true);
  })

  it('should not be complete when date is not set', () => {
    expect(picker.isComplete()).toBe(false);
  })

  it('should update value on constraint update', () => {
    picker.pick(generateDay());

    constraint.changeValidFn(() => ({}));

    expect(picker.value).toBe(null);
  })
});
