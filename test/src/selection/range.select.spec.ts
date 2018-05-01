import { RangeSelect } from '../../../src/selection/range.select';
import { generateDay, MockConstraint } from '../test.utils';

describe('RangeSelect', () => {
  let constraint: MockConstraint;
  let select: RangeSelect;

  beforeEach(() => {
    constraint = new MockConstraint();
    select = new RangeSelect(constraint);
  })

  it('should set value', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    select.setValue(value);

    expect(select.value).toBe(value);
  })

  it('should ensure start is before end', () => {
    const value = {
      start: generateDay(5),
      end: generateDay(1),
    };

    select.setValue(value);

    expect(select.value.start).toBe(value.end);
    expect(select.value.end).toBe(value.start);
  })

  it('should set start date', () => {
    const value = generateDay();

    select.setDate(value);

    expect(select.value.start).toBe(value);
    expect(select.value.end).toBe(undefined);
  })

  it('should set stop date', () => {
    const value = generateDay();

    select.setDate(value, true);

    expect(select.value.start).toBe(undefined);
    expect(select.value.end).toBe(value);
  })

  it('should select start date then end date', () => {
    const start = generateDay();
    const end = generateDay();

    select.select(start);
    select.select(end);

    expect(select.value.start).toBe(start);
    expect(select.value.end).toBe(end);
  })

  it('should select end date', () => {
    const end = generateDay();

    select.select(end, true);

    expect(select.value.end).toBe(end);
  })


  it('should replace start date when new date is before', () => {
    const start = generateDay(1);
    const end = generateDay(5);

    const start2 = generateDay(0);

    select.select(start);
    select.select(end);

    select.select(start2);

    expect(select.value.start).toBe(start2);
    expect(select.value.end).toBe(end);
  })

  it('should replace end date when new date is after', () => {
    const start = generateDay(1);
    const end = generateDay(5);

    const end2 = generateDay(6);

    select.select(start);
    select.select(end);

    select.select(end2);

    expect(select.value.start).toBe(start);
    expect(select.value.end).toBe(end2);
  })

  it('should replace closer date (start)', () => {
    const start = generateDay(1);
    const end = generateDay(5);

    const start2 = generateDay(2);

    select.select(start);
    select.select(end);

    select.select(start2);

    expect(select.value.start).toBe(start2);
    expect(select.value.end).toBe(end);
  })

  it('should replace closer date (end)', () => {
    const start = generateDay(1);
    const end = generateDay(5);

    const end2 = generateDay(4);

    select.select(start);
    select.select(end);

    select.select(end2);

    expect(select.value.start).toBe(start);
    expect(select.value.end).toBe(end2);
  })

  it('should replace start date when diff with both start and end is equal', () => {
    const start = generateDay(1);
    const end = generateDay(5);

    const start2 = generateDay(3);

    select.select(start);
    select.select(end);

    select.select(start2);

    expect(select.value.start).toBe(start2);
    expect(select.value.end).toBe(end);
  })

  it('should use custom replace strategy and replace start date', () => {
    // always replace start date
    select.detectStrategy = (range, date) => false;

    const start = generateDay(1);
    const end = generateDay(5);

    const end2 = generateDay(6);

    select.setValue({start, end});
    select.select(end2);

    expect(select.value.start).toBe(end);
    expect(select.value.end).toBe(end2);
  })

  it('should remove start date if it\'s already selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    select.setValue(value);

    select.select(value.start);

    expect(select.value.start).toBe(undefined);
    expect(select.value.end).toBe(value.end);
  })

  it('should remove end date if it\'s already selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    select.setValue(value);

    select.select(value.end);

    expect(select.value.start).toBe(value.start);
    expect(select.value.end).toBe(undefined);
  })

  it('should not remove a not already selected date', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    select.setValue(value);

    select.unselect(generateDay());

    expect(select.value).toBe(value);
  })

  it('should return true if date is selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    select.setValue(value);

    expect(select.isSelected(value.start)).toBe(true);
    expect(select.isSelected(value.end)).toBe(true);
  })

  it('should return false if date is not selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    select.setValue(value);

    expect(select.isSelected(generateDay()));
  })

  it('should be complete when both date are set', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    select.setValue(value);

    expect(select.isComplete()).toBe(true);
  })

  it('should not be complete when at least one date is not set', () => {

    select.setValue({ });
    expect(select.isComplete()).toBe(false);

    select.setValue({ start: generateDay() });
    expect(select.isComplete()).toBe(false);

    select.setValue({ end: generateDay() });
    expect(select.isComplete()).toBe(false);
  })

  it('should update value on constraint update', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    select.setValue(value);

    constraint.changeValidFn(() => ({}));

    expect(select.value.start).toBe(null);
    expect(select.value.end).toBe(null);
  })
});
