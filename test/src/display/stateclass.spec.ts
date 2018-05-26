import { EventEmitter, Renderer2, RendererStyleFlags2 } from '@angular/core';

import { DayState, StateClass, StateClassesName } from '../../../src/display/stateclass';
import { DatePicker, EmitOptions } from '../../../src/pickers/base';
import { DateConstraint } from '../../../src/validator/directives';

import '../matchers';

describe('StateClass -', () => {
  let constraint: MockConstraint;
  let picker: MockPicker;
  let renderer: MockRenderer;
  let stateClass: StateClass;

  let validateSpy: jasmine.Spy;
  let ispickedSpy: jasmine.Spy;
  let isInPickSpy: jasmine.Spy;

  function setupInstances(classes: StateClassesName = null) {
    constraint = new MockConstraint();
    picker = new MockPicker(null, constraint);
    renderer = new MockRenderer();
    stateClass = new StateClass(picker, classes, constraint, {nativeElement: null}, renderer);

    validateSpy = spyOn(constraint, 'validate');
    ispickedSpy = spyOn(picker, 'isPicked');
    isInPickSpy = spyOn(picker, 'isInPick');
  }

  function expectClassToBe(className: string) {
    expect(renderer.getClasses() as any).toEqual([className]);
  }

  function setSpiesReturnAndUpdate(isValid: boolean, ispicked: boolean, isInpickion: boolean) {
    validateSpy.and.returnValue(isValid ? null : {});
    ispickedSpy.and.returnValue(ispicked);
    isInPickSpy.and.returnValue(isInpickion);

    stateClass.ngOnChanges();
  }

  function emitpickionChange(ispicked: boolean, isInpickion: boolean) {
    ispickedSpy.and.returnValue(ispicked);
    isInPickSpy.and.returnValue(isInpickion);

    picker.pickChange.emit();
  }

  function emitConstraintChange(isValid: boolean) {
    validateSpy.and.returnValue(isValid ? null : {});

    constraint.constraintChange.emit();
  }

  describe('with default class name -', () => {
    beforeEach(() => {
      setupInstances();
    })

    it('should set class as valid', () => {
      setSpiesReturnAndUpdate(true, false, false);
      expectClassToBe(DayState.VALID);
    })

    it('should set class as invalid', () => {
      setSpiesReturnAndUpdate(false, false, false);
      expectClassToBe(DayState.INVALID);
    })

    it('should set class as invalid no matter if it\'s in the pickion or not', () => {
      setSpiesReturnAndUpdate(false, true, false);
      expectClassToBe(DayState.INVALID);

      setSpiesReturnAndUpdate(false, false, true);
      expectClassToBe(DayState.INVALID);

      setSpiesReturnAndUpdate(false, true, true);
      expectClassToBe(DayState.INVALID);
    })

    it('should set class as picked', () => {
      setSpiesReturnAndUpdate(true, true, false);
      expectClassToBe(DayState.PICKED);

      setSpiesReturnAndUpdate(true, true, true);
      expectClassToBe(DayState.PICKED);
    })

    it('should set class as inpickion', () => {
      setSpiesReturnAndUpdate(true, false, true);
      expectClassToBe(DayState.IN_PICK);
    })

    it('should update on input change', () => {
      setSpiesReturnAndUpdate(true, false, false);

      ispickedSpy.and.returnValue(true);
      stateClass.ngOnChanges();

      expectClassToBe(DayState.PICKED);
    })

    it('should update when constraints change', () => {
      setSpiesReturnAndUpdate(true, false, false);

      emitConstraintChange(false);

      expectClassToBe(DayState.INVALID);
    })

    it('should update when pickion changes', () => {
      setSpiesReturnAndUpdate(true, false, false);

      emitpickionChange(true, false);

      expectClassToBe(DayState.PICKED);
    })

    it('pickion change shouldn\'t affect invalid state', () => {
      setSpiesReturnAndUpdate(false, false, false);

      emitpickionChange(true, false);

      expectClassToBe(DayState.INVALID);
    })

    it('should update when constraint then pickion changes', () => {
      setSpiesReturnAndUpdate(false, false, false);

      emitConstraintChange(true);
      emitpickionChange(true, false);

      expectClassToBe(DayState.PICKED);
    })

    // bug fixed
    it('should update when pickion then constraint changes', () => {
      setSpiesReturnAndUpdate(false, false, false);

      emitpickionChange(true, false);
      emitConstraintChange(true);

      expectClassToBe(DayState.PICKED);
    })
  })

  describe('with custom class name -', () => {

    it('should use custom valid class name and keep others as default', () => {
      setupInstances({valid: '__ok'});
      setSpiesReturnAndUpdate(true, false, false);

      expectClassToBe('__ok');

      setSpiesReturnAndUpdate(false, false, false);
      expectClassToBe(DayState.INVALID);

      setSpiesReturnAndUpdate(true, true, false);
      expectClassToBe(DayState.PICKED);

      setSpiesReturnAndUpdate(true, false, true);
      expectClassToBe(DayState.IN_PICK);
    })

    it('should use custom class name for all states', () => {
      setupInstances({
        valid: '__ok',
        invalid: '__notOk',
        picked: '__isActivated',
        inPick: '__isPartiallyActivated',
      });

      setSpiesReturnAndUpdate(true, false, false);
      expectClassToBe('__ok');

      setSpiesReturnAndUpdate(false, false, false);
      expectClassToBe('__notOk');

      setSpiesReturnAndUpdate(true, true, false);
      expectClassToBe('__isActivated');

      setSpiesReturnAndUpdate(true, false, true);
      expectClassToBe('__isPartiallyActivated');
    })
  })

})

class MockConstraint extends DateConstraint {
  constructor() {
    super([])
  }
}

class MockPicker extends DatePicker<Date, void> {
  pickionChange = new EventEmitter<Date>();

  protected isValid: (date: Date) => boolean;
  protected onTouchedCallback: () => void;
  public writeValue(value: any): void {
    throw new Error('Should not be called');
  }
  public registerOnChange(fn: (_: Date) => void): void {
    throw new Error('Should not be called');
  }
  public registerOnTouched(fn: () => void): void {
    throw new Error('Should not be called');
  }
  public setValue(value: Date, options?: EmitOptions): void {
    throw new Error('Should not be called');
  }
  public pick(date: Date) {
    throw new Error('Should not be called');
  }
  public unpick(date: Date) {
    throw new Error('Should not be called');
  }
  public isPicked(date: Date): boolean {
    throw new Error('Should not be called');
  }
  public isInPick(date: Date): boolean {
    throw new Error('Should not be called');
  }
  protected updateValidity(): void { }
  protected add(date: Date, extra?: void): boolean {
    throw new Error('Should not be called');
  }
  protected remove(date: Date, extra?: void): boolean {
    throw new Error('Should not be called');
  }
  public isComplete(): boolean {
    throw new Error('Should not be called');
  }
}

class MockRenderer implements Renderer2 {
  data: { [key: string]: any; };
  destroy(): void {
    throw new Error('Should not be called');
  }
  createElement(name: string, namespace?: string) {
    throw new Error('Should not be called');
  }
  createComment(value: string) {
    throw new Error('Should not be called');
  }
  createText(value: string) {
    throw new Error('Should not be called');
  }
  destroyNode: (node: any) => void;
  appendChild(parent: any, newChild: any): void {
    throw new Error('Should not be called');
  }
  insertBefore(parent: any, newChild: any, refChild: any): void {
    throw new Error('Should not be called');
  }
  removeChild(parent: any, oldChild: any): void {
    throw new Error('Should not be called');
  }
  selectRootElement(pickorOrNode: any) {
    throw new Error('Should not be called');
  }
  parentNode(node: any) {
    throw new Error('Should not be called');
  }
  nextSibling(node: any) {
    throw new Error('Should not be called');
  }
  setAttribute(el: any, name: string, value: string, namespace?: string): void {
    throw new Error('Should not be called');
  }
  removeAttribute(el: any, name: string, namespace?: string): void {
    throw new Error('Should not be called');
  }
  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    throw new Error('Should not be called');
  }
  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    throw new Error('Should not be called');
  }
  setProperty(el: any, name: string, value: any): void {
    throw new Error('Should not be called');
  }
  setValue(node: any, value: string): void {
    throw new Error('Should not be called');
  }
  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    throw new Error('Should not be called');
  }

  private classes = new Set<string>();

  addClass(el: any, className: string) {
    this.classes.add(className);
  }

  removeClass(el: any, className: string) {
    this.classes.delete(className);
  }

  getClasses() {
    return this.classes;
  }
}
