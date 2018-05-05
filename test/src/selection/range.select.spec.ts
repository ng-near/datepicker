import { RangeSelect, RangeSelectType } from '../../../src/selection/range.select';
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
    const { end } = select.value;
    const date = generateDay();

    expect(select.setDate(date, RangeSelectType.START_DATE)).toBe(true);

    expect(select.value.start).toBe(date);
    expect(select.value.end).toBe(end);
  })

  it('should set end date', () => {
    const { start } = select.value;
    const date = generateDay();

    expect(select.setDate(date, RangeSelectType.END_DATE)).toBe(true);

    expect(select.value.start).toBe(start);
    expect(select.value.end).toBe(date);
  })

  it('should set both date', () => {
    const date = generateDay();

    expect(select.setDate(date, RangeSelectType.BOTH_DATES)).toBe(true);

    expect(select.value.start).toBe(date);
    expect(select.value.end).toBe(date);
  })

  it('should not set any date', () => {
    const prevValue = select.value;
    const date = generateDay();

    expect(select.setDate(date, RangeSelectType.NONE)).toBe(false);
    expect(select.value).toBe(prevValue);
  })

  it('should not reset same date', () => {
    const value = {start: generateDay(), end: generateDay()};
    select.setValue(value);

    expect(select.setDate(new Date(value.start), RangeSelectType.START_DATE)).toBe(false);
    expect(select.value).toBe(value);
  })

  it('should select start date then end date', () => {
    const start = generateDay();
    const end = generateDay();

    select.select(start);
    select.select(end);

    expect(select.value.start).toBe(start);
    expect(select.value.end).toBe(end);
  })

  it('should always select start date', () => {
    const date1 = generateDay();
    const date2 = generateDay();
    const date3 = generateDay();

    select.select(date1, RangeSelectType.START_DATE);
    expect(select.value.start).toBe(date1);
    expect(select.value.end).toBe(undefined);

    select.select(date2, RangeSelectType.START_DATE);
    expect(select.value.start).toBe(date2);
    expect(select.value.end).toBe(undefined);

    select.select(date3, RangeSelectType.START_DATE);
    expect(select.value.start).toBe(date3);
    expect(select.value.end).toBe(undefined);
  })

  it('should always select end date', () => {
    const date1 = generateDay();
    const date2 = generateDay();
    const date3 = generateDay();

    select.select(date1, RangeSelectType.END_DATE);
    expect(select.value.start).toBe(undefined);
    expect(select.value.end).toBe(date1);

    select.select(date2, RangeSelectType.END_DATE);
    expect(select.value.start).toBe(undefined);
    expect(select.value.end).toBe(date2);

    select.select(date3, RangeSelectType.END_DATE);
    expect(select.value.start).toBe(undefined);
    expect(select.value.end).toBe(date3);
  })

  describe('default select strategy', () => {
    it('should select both date where they\'re both null', () => {
      const start = generateDay(1);
      const end = generateDay(5);

      const start2 = generateDay(0);

      select.select(start);
      select.select(end);

      select.select(start2);

      expect(select.value.start).toBe(start2);
      expect(select.value.end).toBe(end);
    })

    it('should replace start date when new date is before', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      select.setValue(value);

      const start2 = generateDay(0);
      select.select(start2);

      expect(select.value.start).toBe(start2);
      expect(select.value.end).toBe(value.end);
    })

    it('should replace end date when new date is after', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      select.setValue(value);

      const end2 = generateDay(6);
      select.select(end2);

      expect(select.value.start).toBe(value.start);
      expect(select.value.end).toBe(end2);
    })

    it('should replace closer date (start)', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      select.setValue(value);

      const start2 = generateDay(2);
      select.select(start2);

      expect(select.value.start).toBe(start2);
      expect(select.value.end).toBe(value.end);
    })

    it('should replace closer date (end)', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      select.setValue(value);

      const end2 = generateDay(4);
      select.select(end2);

      expect(select.value.start).toBe(value.start);
      expect(select.value.end).toBe(end2);
    })

    it('should replace end date when diff with both start and end is equal', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      select.setValue(value);

      const end2 = generateDay(3);
      select.select(end2);

      expect(select.value.start).toBe(value.start);
      expect(select.value.end).toBe(end2);
    })
  })

  describe('custom select and unselect strategy', () => {

    beforeEach(() => {
      select.selectStrategy = (range, date) => RangeSelectType.START_DATE;
      select.unselectStrategy = (range, date) => RangeSelectType.START_DATE;
    })

    it('should replace start date', () => {

      const start = generateDay(1);
      const end = generateDay(5);

      const end2 = generateDay(6);

      select.setValue({start, end});
      select.select(end2);

      expect(select.value.start).toBe(end);
      expect(select.value.end).toBe(end2);
    })

    it('should unselect only start date', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      select.setValue(value);

      select.unselect(value.end);
      expect(select.value).toBe(value);

      select.unselect(value.start);
      expect(select.value.start).toBe(undefined);
      expect(select.value.end).toBe(value.end);
    })
  });

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

  describe('close range', () => {
    beforeEach(() => {
      select.openRange = false;
      select.setValue({start: generateDay(1), end: generateDay(3)});
    })

    it('should be in selection if date is between start and end', () => {
      expect(select.isInSelection(generateDay(2))).toBe(true);
    })

    it('should be in selection if date is same as start', () => {
      expect(select.isInSelection(generateDay(1))).toBe(true);
    })

    it('should be in selection if date is same as end', () => {
      expect(select.isInSelection(generateDay(3))).toBe(true);
    })

    it('should not be in selection if date is before start', () => {
      expect(select.isInSelection(generateDay(0))).toBe(false);
    })

    it('should not be in selection if date is after end', () => {
      expect(select.isInSelection(generateDay(4))).toBe(false);
    })

    it('should not be in selection if one date is null', () => {
      select.setValue({start: null, end: generateDay(3)});
      expect(select.isInSelection(generateDay(2))).toBe(false);
      expect(select.isInSelection(generateDay(3))).toBe(false);
      expect(select.isInSelection(generateDay(4))).toBe(false);

      select.setValue({start: generateDay(1), end: null});
      expect(select.isInSelection(generateDay(0))).toBe(false);
      expect(select.isInSelection(generateDay(1))).toBe(false);
      expect(select.isInSelection(generateDay(2))).toBe(false);
    })
  })

  describe('open range', () => {
    beforeEach(() => {
      select.openRange = true;
      select.setValue({start: generateDay(1), end: generateDay(3)});
    })

    it('should be in selection if date is between start and end', () => {
      expect(select.isInSelection(generateDay(2))).toBe(true);
    })

    it('should be in selection if date is same as start', () => {
      expect(select.isInSelection(generateDay(1))).toBe(true);
    })

    it('should be in selection if date is same as end', () => {
      expect(select.isInSelection(generateDay(3))).toBe(true);
    })

    it('should not be in selection if date is before start', () => {
      expect(select.isInSelection(generateDay(0))).toBe(false);
    })

    it('should not be in selection if date is after end', () => {
      expect(select.isInSelection(generateDay(4))).toBe(false);
    })

    it('should be in selection if date is equal or after start and end is null', () => {
      select.setValue({start: generateDay(1), end: null});
      expect(select.isInSelection(generateDay(0))).toBe(false);
      expect(select.isInSelection(generateDay(1))).toBe(true);
      expect(select.isInSelection(generateDay(2))).toBe(true);
    })

    it('should be in selection if date is equal or before end and start is null', () => {
      select.setValue({start: null, end: generateDay(3)});
      expect(select.isInSelection(generateDay(2))).toBe(true);
      expect(select.isInSelection(generateDay(3))).toBe(true);
      expect(select.isInSelection(generateDay(4))).toBe(false);
    })
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
