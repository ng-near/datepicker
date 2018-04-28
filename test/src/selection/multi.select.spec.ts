import { MultiSelect } from '../../../src/selection/multi.select';
import { generateDay, MockConstraint, newMockConstraint } from '../test.utils';

describe('MultiSelect', () => {
  let constraint: MockConstraint;
  let select: MultiSelect;

  beforeEach(() => {
    constraint = newMockConstraint();
    select = new MultiSelect(constraint);
  })

  it('should add a date', () => {
    const value = generateDay();

    select.select(value);

    expect(select.value).toEqual([value]);
  })

  it('should add multiple dates', () => {
    const values = [];

    for (let i = 0; i < 100; i++) {
      const value = generateDay();
      values.push(value);
      select.select(value);
    }

    expect(select.value).toEqual(values);
  })

  it('should remove the date if it\'s already selected', () => {
    const value = generateDay();
    select.select(value);

    select.select(value);

    expect(select.value.length).toBe(0);
  })

  it('should remove an already selected date', () => {
    const value = generateDay();

    select.select(value);
    select.unselect(value);

    expect(select.value.length).toBe(0);
  })

  it('should remove an already selected date, and only this one', () => {
    const value1 = generateDay();
    const value2 = generateDay();
    const value3 = generateDay();
    const value4 = generateDay();

    select.select(value1);
    select.select(value2);
    select.select(value3);
    select.select(value4);

    select.unselect(value2);

    expect(select.value).toEqual([value1, value3, value4]);
  })

  it('should not remove a not already selected date', () => {
    const value = generateDay();
    select.select(value);

    select.unselect(generateDay());

    expect(select.value).toEqual([value]);
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

  it('should never be complete if not limit is set', () => {
    for (let i = 0; i < 50; i++) {
      select.select(generateDay());
      expect(select.isComplete()).toBe(false);
    }
  })

  it('should return true if date is selected', () => {
    const value = generateDay();

    select.select(value);

    expect(select.isSelected(value)).toBe(true);
  })

  it('should return false if date is not selected', () => {
    select.select(generateDay());

    expect(select.isSelected(generateDay())).toBe(false);
  })

  it('should update value on constraint update', () => {
    const value1 = generateDay();
    const value2 = generateDay();
    const value3 = generateDay();

    select.select(value1);
    select.select(value2);
    select.select(value3);

    constraint.changeValidFn(d => d === value2);

    expect(select.value).toEqual([value2]);
  })

  describe('with limit -', () => {
    it('should not add anymore date when limit is reached', () => {
      const value = generateDay();

      select.limit = 1;
      select.select(value);

      select.select(generateDay());

      expect(select.value).toEqual([value]);
    })

    it('should be able to re-add date once we removed some', () => {
      const value1 = generateDay();
      const value2 = generateDay();
      const value3 = generateDay();

      select.limit = 2;
      select.select(value1);
      select.select(value2);

      select.unselect(value1);

      select.select(value3);

      expect(select.value).toEqual([value2, value3]);
    })

    it('should not be complete when limit is not reached', () => {
      select.limit = 2;
      select.select(generateDay());

      expect(select.isComplete()).toBe(false);
    })

    it('should be complete when limit is reached', () => {
      select.limit = 2;
      select.select(generateDay());
      select.select(generateDay());

      expect(select.isComplete()).toBe(true);
    })

    it('should remove last selected dates when limit is reduced', () => {
      const value1 = generateDay();
      const value2 = generateDay();

      select.limit = 2;
      select.select(value1);
      select.select(value2);

      select.limit = 1;
      // should use angular fixture
      select.ngOnChanges({limit: <any>null});

      expect(select.value).toEqual([value1]);
    })
  })
});
