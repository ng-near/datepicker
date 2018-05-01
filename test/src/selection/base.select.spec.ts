import { DatepickerSelect } from '../../../src/selection/base.select';
import { generateDay, MockConstraint } from '../test.utils';

class EMPTY {}
const EMPTY_VALUE = new EMPTY();

class MockSelect<T> extends DatepickerSelect<T, any> {

  constructor(constraint: MockConstraint) {
    super(<any>EMPTY_VALUE, constraint);
  }

  public isValid: (date: Date) => boolean;

  // @ts-ignore
  updateValidity = jasmine.createSpy('updateValidity');
  // @ts-ignore
  add = jasmine.createSpy('add');
  // @ts-ignore
  remove = jasmine.createSpy('remove');
  // @ts-ignore
  isSelected = jasmine.createSpy('isSelected');
  // @ts-ignore
  isComplete = jasmine.createSpy('isComplete');
}

describe('DatepickerSelect -', () => {

  let constraint: MockConstraint;
  let select: MockSelect<any>;
  let emitToViewSpy: jasmine.Spy;
  let emitSpy: jasmine.Spy;

  beforeEach(() => {
    constraint = new MockConstraint();
    select = new MockSelect(constraint);

    emitToViewSpy = jasmine.createSpy('on change callback');
    emitSpy = spyOn(select.selectionChange, 'emit');

    select.registerOnChange(emitToViewSpy);
  })

  it('should be initialized with empty value', () => {
    // test must right after constructor
    const instance = new MockSelect(constraint);
    expect(instance.value).toBe(EMPTY_VALUE);
  });

  it('should set the value and emit', () => {
    const value = generateDay();

    select.setValue(value);

    expect(select.value).toBe(value);
    expect(emitSpy).toHaveBeenCalledWith(value);
  });

  it('should set the value and do not emit', () => {
    const value = generateDay();

    select.setValue(value, {emitEvent: false});

    expect(select.value).toBe(value);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit when setting same value', () => {
    const value = generateDay();

    select.setValue(value);

    emitSpy.calls.reset();

    select.setValue(value);
    expect(select.value).toBe(value);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should set null value', () => {
    const value = generateDay();

    select.setValue(null);
    expect(select.value).toBe(null);
  });

  it('should set undefined value', () => {
    const value = generateDay();

    select.setValue(undefined);
    expect(select.value).toBe(undefined);
  });

  describe('selecting dates -', () => {

    it('should add date', () => {
      const value = generateDay();
      select.remove.and.returnValue(false);

      select.select(value);

      expect(select.add.calls.count()).toBe(1);
      expect(select.add.calls.mostRecent().args[0]).toBe(value);
    });

    it('select() should delegate extra arg to add()', () => {
      const value = generateDay();
      const extra = {};

      select.select(value, extra);

      expect(select.add).toHaveBeenCalledWith(value, extra);
    });

    it('select() should delegate extra arg to remove()', () => {
      const value = generateDay();
      const extra = {};

      select.select(value, extra);

      expect(select.remove).toHaveBeenCalledWith(value, extra);
    });

    it('should not add invalid dates', () => {
      const value = generateDay();
      select.setValue(value);

      select.select(null);
      select.select(undefined);

      // register a dateConstaint instead of that spy ?
      spyOn(select, 'isValid').and.returnValue(false);
      select.select(generateDay());

      expect(select.add).not.toHaveBeenCalled();
    });

    it('should remove an already selected date', () => {
      const value = generateDay();

      select.remove.and.returnValue(true);

      select.select(value);

      expect(select.add).not.toHaveBeenCalled();
      expect(select.remove.calls.count()).toBe(1);
      expect(select.remove.calls.mostRecent().args[0]).toBe(value);
    });

    it('should remove an already equivalent date', () => {
      const value = generateDay(1);
      const value2 = generateDay(1);

      select.remove.and.returnValue(true);

      select.select(value2);

      expect(select.add).not.toHaveBeenCalled();
      expect(select.remove.calls.count()).toBe(1);
      expect(select.remove.calls.mostRecent().args[0]).toBe(value2);
    });

    it('should remove date', () => {
      const value = generateDay();
      select.unselect(value);

      expect(select.remove.calls.count()).toBe(1);
      expect(select.remove.calls.mostRecent().args[0]).toBe(value);
    });

    it('should not remove null or undefined', () => {
      const value = generateDay();

      select.unselect(null);
      select.unselect(undefined);

      expect(select.remove).not.toHaveBeenCalled();
    });
  });

  describe('ValueAccessor -', () => {
    it('should register onChange callback and call it when setting value', () => {
      const onChangeCb = jasmine.createSpy('onChange callback');
      const value = generateDay();

      select.registerOnChange(onChangeCb);
      select.setValue(value);

      expect(onChangeCb).toHaveBeenCalledWith(value, true);
    })

    it('should not call onChange callback', () => {
      const value = generateDay();

      select.setValue(value, {emitModelToViewChange: false});
      expect(emitToViewSpy).not.toHaveBeenCalled();
    })

    it('should call onChange callback with false as 2nd arg', () => {
      const value = generateDay();

      select.setValue(value, {emitViewToModelChange: false});
      expect(emitToViewSpy).toHaveBeenCalledWith(value, false);
    })

    it('should not call onChange callback', () => {
      const value = generateDay();

      select.setValue(value, {emitModelToViewChange: false, emitViewToModelChange: false});
      expect(emitToViewSpy).not.toHaveBeenCalled();
    })

    it('should write value without calling onChange callback', () => {
      const value = generateDay();

      select.writeValue(value);
      expect(select.value).toBe(value);
      expect(emitToViewSpy).not.toHaveBeenCalled();
    })

    it('should register on touched and call it when selecting and unselecting dates', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();

      select.registerOnTouched(onTouchedCb);

      select.add.and.returnValue(true);
      select.select(value);
      expect(onTouchedCb).toHaveBeenCalled();
    })

    it('should register on touched and call it when unselecting dates', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();

      select.registerOnTouched(onTouchedCb);

      select.remove.and.returnValue(true);
      select.select(value);
      expect(onTouchedCb).toHaveBeenCalled();
    })

    it('should not call onTouched callback when selecting invalid dates', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();

      select.registerOnTouched(onTouchedCb);

      select.select(null);
      select.select(undefined);

      // register a dateConstaint instead of that spy ?
      spyOn(select, 'isValid').and.returnValue(false);
      select.select(value);

      expect(onTouchedCb).not.toHaveBeenCalled();
    })

    it('should not call onTouched when unselecting not selected date', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();
      select.remove.and.returnValue(false);

      select.registerOnTouched(onTouchedCb);
      select.unselect(value);

      expect(onTouchedCb).not.toHaveBeenCalled();
    })
  })

  describe('constraints -', () => {
    it('date validity should match constraint', () => {
      const date1 = generateDay();
      const date2 = generateDay();

      constraint.changeValidFn(date => date !== date2 ? null : {});

      expect(select.isValid(date1)).toBe(true);
      expect(select.isValid(date2)).toBe(false);
    });

    it('should call updateValidity() when contrainst changes', () => {
      constraint.constraintChange.emit();

      expect(select.updateValidity).toHaveBeenCalled();
    });
  })
});
