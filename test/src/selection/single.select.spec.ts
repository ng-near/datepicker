import { SingleSelect } from '../../../src/selection/single.select';
import { generateDay, MockConstraint } from '../test.utils';

describe('SingleSelect', () => {
  let constraint: MockConstraint;
  let select: SingleSelect;

  beforeEach(() => {
    constraint = new MockConstraint();
    select = new SingleSelect(constraint);
  })

  it('should select a date', () => {
    const value = generateDay();

    select.select(value);

    expect(select.value).toBe(value);
  })

  it('should replace a date', () => {
    select.select(generateDay());

    const value = generateDay();
    select.select(value);

    expect(select.value).toBe(value);
  })

  it('should remove the date if it\'s already selected', () => {
    const value = generateDay();
    select.select(value);

    select.select(value);

    expect(select.value).toBe(undefined);
  })

  it('should remove an already selected date', () => {
    const value = generateDay();

    select.select(value);
    select.unselect(value);

    expect(select.value).toBe(undefined);
  })

  it('should not remove a not already selected date', () => {
    const value = generateDay();
    select.select(value);

    select.unselect(generateDay());

    expect(select.value).toBe(value);
  })

  it('should return true if date is selected', () => {
    const value = generateDay();
    select.select(value);

    expect(select.isSelected(value)).toBe(true);
  })

  it('should return false if date is not selected', () => {
    const value = generateDay();
    select.select(value);

    expect(select.isSelected(generateDay()));
  })

  it('should be complete when date is set', () => {
    const value = generateDay();
    select.select(value);

    expect(select.isComplete()).toBe(true);
  })

  it('should not be complete when date is not set', () => {
    expect(select.isComplete()).toBe(false);
  })

  it('should update value on constraint update', () => {
    select.select(generateDay());

    constraint.changeValidFn(() => ({}));

    expect(select.value).toBe(null);
  })
});
