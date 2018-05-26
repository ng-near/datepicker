import { MultiPicker } from '../../../src/pickers/multi';
import { generateDay, MockConstraint } from '../test.utils';

describe('MultiPicker', () => {
  let constraint: MockConstraint;
  let picker: MultiPicker;

  beforeEach(() => {
    constraint = new MockConstraint();
    picker = new MultiPicker(constraint);
  })

  it('should add a date', () => {
    const value = generateDay();

    picker.pick(value);

    expect(picker.value).toEqual([value]);
  })

  it('should add multiple dates', () => {
    const values = [];

    for (let i = 0; i < 100; i++) {
      const value = generateDay();
      values.push(value);
      picker.pick(value);
    }

    expect(picker.value).toEqual(values);
  })

  it('should remove the date if it\'s already picked', () => {
    const value = generateDay();
    picker.pick(value);

    picker.pick(value);

    expect(picker.value.length).toBe(0);
  })

  it('should remove an already picked date', () => {
    const value = generateDay();

    picker.pick(value);
    picker.unpick(value);

    expect(picker.value.length).toBe(0);
  })

  it('should remove an already picked date, and only this one', () => {
    const value1 = generateDay();
    const value2 = generateDay();
    const value3 = generateDay();
    const value4 = generateDay();

    picker.pick(value1);
    picker.pick(value2);
    picker.pick(value3);
    picker.pick(value4);

    picker.unpick(value2);

    expect(picker.value).toEqual([value1, value3, value4]);
  })

  it('should not remove a not already picked date', () => {
    const value = generateDay();
    picker.pick(value);

    picker.unpick(generateDay());

    expect(picker.value).toEqual([value]);
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

  it('should never be complete if not limit is set', () => {
    for (let i = 0; i < 50; i++) {
      picker.pick(generateDay());
      expect(picker.isComplete()).toBe(false);
    }
  })

  it('should return true if date is picked', () => {
    const value = generateDay();

    picker.pick(value);

    expect(picker.isPicked(value)).toBe(true);
  })

  it('should return false if date is not picked', () => {
    picker.pick(generateDay());

    expect(picker.isPicked(generateDay())).toBe(false);
  })

  it('should update value on constraint update', () => {
    const value1 = generateDay();
    const value2 = generateDay();
    const value3 = generateDay();

    picker.pick(value1);
    picker.pick(value2);
    picker.pick(value3);

    constraint.changeValidFn(d => d === value2 ? null : {});

    expect(picker.value).toEqual([value2]);
  })

  describe('with limit -', () => {
    it('should not add anymore date when limit is reached', () => {
      const value = generateDay();

      picker.limit = 1;
      picker.pick(value);

      picker.pick(generateDay());

      expect(picker.value).toEqual([value]);
    })

    it('should be able to re-add date once we removed some', () => {
      const value1 = generateDay();
      const value2 = generateDay();
      const value3 = generateDay();

      picker.limit = 2;
      picker.pick(value1);
      picker.pick(value2);

      picker.unpick(value1);

      picker.pick(value3);

      expect(picker.value).toEqual([value2, value3]);
    })

    it('should not be complete when limit is not reached', () => {
      picker.limit = 2;
      picker.pick(generateDay());

      expect(picker.isComplete()).toBe(false);
    })

    it('should be complete when limit is reached', () => {
      picker.limit = 2;
      picker.pick(generateDay());
      picker.pick(generateDay());

      expect(picker.isComplete()).toBe(true);
    })

    it('should remove last picked dates when limit is reduced', () => {
      const value1 = generateDay();
      const value2 = generateDay();

      picker.limit = 2;
      picker.pick(value1);
      picker.pick(value2);

      picker.limit = 1;
      // should use angular fixture
      picker.ngOnChanges({limit: <any>null});

      expect(picker.value).toEqual([value1]);
    })
  })
});
