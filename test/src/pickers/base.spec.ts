import { DatePicker } from '../../../src/pickers/base';
import { generateDay, MockConstraint } from '../test.utils';

class EMPTY {}
const EMPTY_VALUE = new EMPTY();

class MockPicker<T> extends DatePicker<T, any> {

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
  isPicked = jasmine.createSpy('isPicked');
  // @ts-ignore
  isComplete = jasmine.createSpy('isComplete');
}

describe('Datepickerpick -', () => {

  let constraint: MockConstraint;
  let picker: MockPicker<any>;
  let emitToViewSpy: jasmine.Spy;
  let emitSpy: jasmine.Spy;

  beforeEach(() => {
    constraint = new MockConstraint();
    picker = new MockPicker(constraint);

    emitToViewSpy = jasmine.createSpy('on change callback');
    emitSpy = spyOn(picker.pickChange, 'emit');

    picker.registerOnChange(emitToViewSpy);
  })

  it('should be initialized with empty value', () => {
    // test must right after constructor
    const instance = new MockPicker(constraint);
    expect(instance.value).toBe(EMPTY_VALUE);
  });

  it('should set the value and emit', () => {
    const value = generateDay();

    picker.setValue(value);

    expect(picker.value).toBe(value);
    expect(emitSpy).toHaveBeenCalledWith(value);
  });

  it('should set the value and do not emit', () => {
    const value = generateDay();

    picker.setValue(value, {emitEvent: false});

    expect(picker.value).toBe(value);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not emit when setting same value', () => {
    const value = generateDay();

    picker.setValue(value);

    emitSpy.calls.reset();

    picker.setValue(value);
    expect(picker.value).toBe(value);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should set null value', () => {
    const value = generateDay();

    picker.setValue(null);
    expect(picker.value).toBe(null);
  });

  it('should set undefined value', () => {
    const value = generateDay();

    picker.setValue(undefined);
    expect(picker.value).toBe(undefined);
  });

  describe('picking dates -', () => {

    it('should add date', () => {
      const value = generateDay();
      picker.remove.and.returnValue(false);

      picker.pick(value);

      expect(picker.add.calls.count()).toBe(1);
      expect(picker.add.calls.mostRecent().args[0]).toBe(value);
    });

    it('pick() should delegate extra arg to add()', () => {
      const value = generateDay();
      const extra = {};

      picker.pick(value, extra);

      expect(picker.add).toHaveBeenCalledWith(value, extra);
    });

    it('pick() should delegate extra arg to remove()', () => {
      const value = generateDay();
      const extra = {};

      picker.pick(value, extra);

      expect(picker.remove).toHaveBeenCalledWith(value, extra);
    });

    it('should not add invalid dates', () => {
      const value = generateDay();
      picker.setValue(value);

      picker.pick(null);
      picker.pick(undefined);

      // register a dateConstaint instead of that spy ?
      spyOn(picker, 'isValid').and.returnValue(false);
      picker.pick(generateDay());

      expect(picker.add).not.toHaveBeenCalled();
    });

    it('should remove an already picked date', () => {
      const value = generateDay();

      picker.remove.and.returnValue(true);

      picker.pick(value);

      expect(picker.add).not.toHaveBeenCalled();
      expect(picker.remove.calls.count()).toBe(1);
      expect(picker.remove.calls.mostRecent().args[0]).toBe(value);
    });

    it('should remove an already equivalent date', () => {
      const value = generateDay(1);
      const value2 = generateDay(1);

      picker.remove.and.returnValue(true);

      picker.pick(value2);

      expect(picker.add).not.toHaveBeenCalled();
      expect(picker.remove.calls.count()).toBe(1);
      expect(picker.remove.calls.mostRecent().args[0]).toBe(value2);
    });

    it('should remove date', () => {
      const value = generateDay();
      picker.unpick(value);

      expect(picker.remove.calls.count()).toBe(1);
      expect(picker.remove.calls.mostRecent().args[0]).toBe(value);
    });

    it('should not remove null or undefined', () => {
      const value = generateDay();

      picker.unpick(null);
      picker.unpick(undefined);

      expect(picker.remove).not.toHaveBeenCalled();
    });
  });

  describe('ValueAccessor -', () => {
    it('should register onChange callback and call it when setting value', () => {
      const onChangeCb = jasmine.createSpy('onChange callback');
      const value = generateDay();

      picker.registerOnChange(onChangeCb);
      picker.setValue(value);

      expect(onChangeCb).toHaveBeenCalledWith(value, true);
    })

    it('should not call onChange callback', () => {
      const value = generateDay();

      picker.setValue(value, {emitModelToViewChange: false});
      expect(emitToViewSpy).not.toHaveBeenCalled();
    })

    it('should call onChange callback with false as 2nd arg', () => {
      const value = generateDay();

      picker.setValue(value, {emitViewToModelChange: false});
      expect(emitToViewSpy).toHaveBeenCalledWith(value, false);
    })

    it('should not call onChange callback', () => {
      const value = generateDay();

      picker.setValue(value, {emitModelToViewChange: false, emitViewToModelChange: false});
      expect(emitToViewSpy).not.toHaveBeenCalled();
    })

    it('should write value without calling onChange callback', () => {
      const value = generateDay();

      picker.writeValue(value);
      expect(picker.value).toBe(value);
      expect(emitToViewSpy).not.toHaveBeenCalled();
    })

    it('should register on touched and call it when picking and unpicking dates', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();

      picker.registerOnTouched(onTouchedCb);

      picker.add.and.returnValue(true);
      picker.pick(value);
      expect(onTouchedCb).toHaveBeenCalled();
    })

    it('should register on touched and call it when unpicking dates', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();

      picker.registerOnTouched(onTouchedCb);

      picker.remove.and.returnValue(true);
      picker.pick(value);
      expect(onTouchedCb).toHaveBeenCalled();
    })

    it('should not call onTouched callback when picking invalid dates', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();

      picker.registerOnTouched(onTouchedCb);

      picker.pick(null);
      picker.pick(undefined);

      // register a dateConstaint instead of that spy ?
      spyOn(picker, 'isValid').and.returnValue(false);
      picker.pick(value);

      expect(onTouchedCb).not.toHaveBeenCalled();
    })

    it('should not call onTouched when unpicking not picked date', () => {
      const onTouchedCb = jasmine.createSpy('onTouched callback');
      const value = generateDay();
      picker.remove.and.returnValue(false);

      picker.registerOnTouched(onTouchedCb);
      picker.unpick(value);

      expect(onTouchedCb).not.toHaveBeenCalled();
    })
  })

  describe('constraints -', () => {
    it('date validity should match constraint', () => {
      const date1 = generateDay();
      const date2 = generateDay();

      constraint.changeValidFn(date => date !== date2 ? null : {});

      expect(picker.isValid(date1)).toBe(true);
      expect(picker.isValid(date2)).toBe(false);
    });

    it('should call updateValidity() when contrainst changes', () => {
      constraint.constraintChange.emit();

      expect(picker.updateValidity).toHaveBeenCalled();
    });
  })
});
