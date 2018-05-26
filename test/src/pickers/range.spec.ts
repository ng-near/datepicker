import { RangePicker, RangePickerType } from '../../../src/pickers/range';
import { generateDay, MockConstraint } from '../test.utils';

describe('RangePicker', () => {
  let constraint: MockConstraint;
  let picker: RangePicker;

  beforeEach(() => {
    constraint = new MockConstraint();
    picker = new RangePicker(constraint);
  })

  it('should set value', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    picker.setValue(value);

    expect(picker.value).toBe(value);
  })

  it('should ensure start is before end', () => {
    const value = {
      start: generateDay(5),
      end: generateDay(1),
    };

    picker.setValue(value);

    expect(picker.value.start).toBe(value.end);
    expect(picker.value.end).toBe(value.start);
  })

  it('should set start date', () => {
    const { end } = picker.value;
    const date = generateDay();

    expect(picker.setDate(date, RangePickerType.START_DATE)).toBe(true);

    expect(picker.value.start).toBe(date);
    expect(picker.value.end).toBe(end);
  })

  it('should set end date', () => {
    const { start } = picker.value;
    const date = generateDay();

    expect(picker.setDate(date, RangePickerType.END_DATE)).toBe(true);

    expect(picker.value.start).toBe(start);
    expect(picker.value.end).toBe(date);
  })

  it('should set both date', () => {
    const date = generateDay();

    expect(picker.setDate(date, RangePickerType.BOTH_DATES)).toBe(true);

    expect(picker.value.start).toBe(date);
    expect(picker.value.end).toBe(date);
  })

  it('should not set any date', () => {
    const prevValue = picker.value;
    const date = generateDay();

    expect(picker.setDate(date, RangePickerType.NONE)).toBe(false);
    expect(picker.value).toBe(prevValue);
  })

  it('should not reset same date', () => {
    const value = {start: generateDay(), end: generateDay()};
    picker.setValue(value);

    expect(picker.setDate(new Date(value.start), RangePickerType.START_DATE)).toBe(false);
    expect(picker.value).toBe(value);
  })

  it('should select start date then end date', () => {
    const start = generateDay();
    const end = generateDay();

    picker.pick(start);
    picker.pick(end);

    expect(picker.value.start).toBe(start);
    expect(picker.value.end).toBe(end);
  })

  it('should always select start date', () => {
    const date1 = generateDay();
    const date2 = generateDay();
    const date3 = generateDay();

    picker.pick(date1, RangePickerType.START_DATE);
    expect(picker.value.start).toBe(date1);
    expect(picker.value.end).toBe(undefined);

    picker.pick(date2, RangePickerType.START_DATE);
    expect(picker.value.start).toBe(date2);
    expect(picker.value.end).toBe(undefined);

    picker.pick(date3, RangePickerType.START_DATE);
    expect(picker.value.start).toBe(date3);
    expect(picker.value.end).toBe(undefined);
  })

  it('should always select end date', () => {
    const date1 = generateDay();
    const date2 = generateDay();
    const date3 = generateDay();

    picker.pick(date1, RangePickerType.END_DATE);
    expect(picker.value.start).toBe(undefined);
    expect(picker.value.end).toBe(date1);

    picker.pick(date2, RangePickerType.END_DATE);
    expect(picker.value.start).toBe(undefined);
    expect(picker.value.end).toBe(date2);

    picker.pick(date3, RangePickerType.END_DATE);
    expect(picker.value.start).toBe(undefined);
    expect(picker.value.end).toBe(date3);
  })

  describe('default select strategy', () => {
    it('should select both date where they\'re both null', () => {
      const start = generateDay(1);
      const end = generateDay(5);

      const start2 = generateDay(0);

      picker.pick(start);
      picker.pick(end);

      picker.pick(start2);

      expect(picker.value.start).toBe(start2);
      expect(picker.value.end).toBe(end);
    })

    it('should replace start date when new date is before', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      picker.setValue(value);

      const start2 = generateDay(0);
      picker.pick(start2);

      expect(picker.value.start).toBe(start2);
      expect(picker.value.end).toBe(value.end);
    })

    it('should replace end date when new date is after', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      picker.setValue(value);

      const end2 = generateDay(6);
      picker.pick(end2);

      expect(picker.value.start).toBe(value.start);
      expect(picker.value.end).toBe(end2);
    })

    it('should replace closer date (start)', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      picker.setValue(value);

      const start2 = generateDay(2);
      picker.pick(start2);

      expect(picker.value.start).toBe(start2);
      expect(picker.value.end).toBe(value.end);
    })

    it('should replace closer date (end)', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      picker.setValue(value);

      const end2 = generateDay(4);
      picker.pick(end2);

      expect(picker.value.start).toBe(value.start);
      expect(picker.value.end).toBe(end2);
    })

    it('should replace end date when diff with both start and end is equal', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      picker.setValue(value);

      const end2 = generateDay(3);
      picker.pick(end2);

      expect(picker.value.start).toBe(value.start);
      expect(picker.value.end).toBe(end2);
    })
  })

  describe('custom select and unselect strategy', () => {

    beforeEach(() => {
      picker.pickStrategy = (range, date) => RangePickerType.START_DATE;
      picker.unpickStrategy = (range, date) => RangePickerType.START_DATE;
    })

    it('should replace start date', () => {

      const start = generateDay(1);
      const end = generateDay(5);

      const end2 = generateDay(6);

      picker.setValue({start, end});
      picker.pick(end2);

      expect(picker.value.start).toBe(end);
      expect(picker.value.end).toBe(end2);
    })

    it('should unselect only start date', () => {
      const value = { start: generateDay(1), end: generateDay(5)};
      picker.setValue(value);

      picker.unpick(value.end);
      expect(picker.value).toBe(value);

      picker.unpick(value.start);
      expect(picker.value.start).toBe(undefined);
      expect(picker.value.end).toBe(value.end);
    })
  });

  it('should remove start date if it\'s already selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    picker.setValue(value);

    picker.pick(value.start);

    expect(picker.value.start).toBe(undefined);
    expect(picker.value.end).toBe(value.end);
  })

  it('should remove end date if it\'s already selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    picker.setValue(value);

    picker.pick(value.end);

    expect(picker.value.start).toBe(value.start);
    expect(picker.value.end).toBe(undefined);
  })

  it('should not remove a not already selected date', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };

    picker.setValue(value);

    picker.unpick(generateDay());

    expect(picker.value).toBe(value);
  })

  it('should return true if date is selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    picker.setValue(value);

    expect(picker.isPicked(value.start)).toBe(true);
    expect(picker.isPicked(value.end)).toBe(true);
  })

  it('should return false if date is not selected', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    picker.setValue(value);

    expect(picker.isPicked(generateDay()));
  })

  describe('close range', () => {
    beforeEach(() => {
      picker.openRange = false;
      picker.setValue({start: generateDay(1), end: generateDay(3)});
    })

    it('should be in selection if date is between start and end', () => {
      expect(picker.isInPick(generateDay(2))).toBe(true);
    })

    it('should be in selection if date is same as start', () => {
      expect(picker.isInPick(generateDay(1))).toBe(true);
    })

    it('should be in selection if date is same as end', () => {
      expect(picker.isInPick(generateDay(3))).toBe(true);
    })

    it('should not be in selection if date is before start', () => {
      expect(picker.isInPick(generateDay(0))).toBe(false);
    })

    it('should not be in selection if date is after end', () => {
      expect(picker.isInPick(generateDay(4))).toBe(false);
    })

    it('should not be in selection if one date is null', () => {
      picker.setValue({start: null, end: generateDay(3)});
      expect(picker.isInPick(generateDay(2))).toBe(false);
      expect(picker.isInPick(generateDay(3))).toBe(false);
      expect(picker.isInPick(generateDay(4))).toBe(false);

      picker.setValue({start: generateDay(1), end: null});
      expect(picker.isInPick(generateDay(0))).toBe(false);
      expect(picker.isInPick(generateDay(1))).toBe(false);
      expect(picker.isInPick(generateDay(2))).toBe(false);
    })

    it('should not be in selection if both date are null', () => {
      picker.setValue({start: null, end: null});
      expect(picker.isInPick(generateDay(4))).toBe(false);
    })
  })

  describe('open range', () => {
    beforeEach(() => {
      picker.openRange = true;
      picker.setValue({start: generateDay(1), end: generateDay(3)});
    })

    it('should be in selection if date is between start and end', () => {
      expect(picker.isInPick(generateDay(2))).toBe(true);
    })

    it('should be in selection if date is same as start', () => {
      expect(picker.isInPick(generateDay(1))).toBe(true);
    })

    it('should be in selection if date is same as end', () => {
      expect(picker.isInPick(generateDay(3))).toBe(true);
    })

    it('should not be in selection if date is before start', () => {
      expect(picker.isInPick(generateDay(0))).toBe(false);
    })

    it('should not be in selection if date is after end', () => {
      expect(picker.isInPick(generateDay(4))).toBe(false);
    })

    it('should be in selection if date is equal or after start and end is null', () => {
      picker.setValue({start: generateDay(1), end: null});
      expect(picker.isInPick(generateDay(0))).toBe(false);
      expect(picker.isInPick(generateDay(1))).toBe(true);
      expect(picker.isInPick(generateDay(2))).toBe(true);
    })

    it('should be in selection if date is equal or before end and start is null', () => {
      picker.setValue({start: null, end: generateDay(3)});
      expect(picker.isInPick(generateDay(2))).toBe(true);
      expect(picker.isInPick(generateDay(3))).toBe(true);
      expect(picker.isInPick(generateDay(4))).toBe(false);
    })

    it('should not be in selection if both date are null', () => {
      picker.setValue({start: null, end: null});
      expect(picker.isInPick(generateDay(4))).toBe(false);
    })
  })

  it('should be complete when both date are set', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    picker.setValue(value);

    expect(picker.isComplete()).toBe(true);
  })

  it('should not be complete when at least one date is not set', () => {

    picker.setValue({ });
    expect(picker.isComplete()).toBe(false);

    picker.setValue({ start: generateDay() });
    expect(picker.isComplete()).toBe(false);

    picker.setValue({ end: generateDay() });
    expect(picker.isComplete()).toBe(false);
  })

  it('should update value on constraint update', () => {
    const value = {
      start: generateDay(),
      end: generateDay(),
    };
    picker.setValue(value);

    constraint.changeValidFn(() => ({}));

    expect(picker.value.start).toBe(null);
    expect(picker.value.end).toBe(null);
  })
});
