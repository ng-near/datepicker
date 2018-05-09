import { EventEmitter, Renderer2, RendererStyleFlags2 } from '@angular/core';

import { DayState, SelectClass, StateClassesName } from '../../../src/display/selectclass';
import { DatepickerSelect, EmitOptions } from '../../../src/selection/base.select';
import { DateConstraint } from '../../../src/validator/directives';

import '../matchers';

describe('SelectClass -', () => {
  let constraint: MockConstraint;
  let select: MockSelect;
  let renderer: MockRenderer;
  let selectClass: SelectClass;

  let validateSpy: jasmine.Spy;
  let isSelectedSpy: jasmine.Spy;
  let isInSelectionSpy: jasmine.Spy;

  function setupInstances(classes: StateClassesName = null) {
    constraint = new MockConstraint();
    select = new MockSelect(null, constraint);
    renderer = new MockRenderer();
    selectClass = new SelectClass(select, classes, constraint, {nativeElement: null}, renderer);

    validateSpy = spyOn(constraint, 'validate');
    isSelectedSpy = spyOn(select, 'isSelected');
    isInSelectionSpy = spyOn(select, 'isInSelection');
  }

  function expectClassToBe(className: string) {
    expect(renderer.getClasses() as any).toEqual([className]);
  }

  function setSpiesReturnAndUpdate(isValid: boolean, isSelected: boolean, isInSelection: boolean) {
    validateSpy.and.returnValue(isValid ? null : {});
    isSelectedSpy.and.returnValue(isSelected);
    isInSelectionSpy.and.returnValue(isInSelection);

    selectClass.ngOnChanges();
  }

  function emitSelectionChange(isSelected: boolean, isInSelection: boolean) {
    isSelectedSpy.and.returnValue(isSelected);
    isInSelectionSpy.and.returnValue(isInSelection);

    select.selectionChange.emit();
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

    it('should set class as invalid no matter if it\'s in the selection or not', () => {
      setSpiesReturnAndUpdate(false, true, false);
      expectClassToBe(DayState.INVALID);

      setSpiesReturnAndUpdate(false, false, true);
      expectClassToBe(DayState.INVALID);

      setSpiesReturnAndUpdate(false, true, true);
      expectClassToBe(DayState.INVALID);
    })

    it('should set class as selected', () => {
      setSpiesReturnAndUpdate(true, true, false);
      expectClassToBe(DayState.SELECTED);

      setSpiesReturnAndUpdate(true, true, true);
      expectClassToBe(DayState.SELECTED);
    })

    it('should set class as inselection', () => {
      setSpiesReturnAndUpdate(true, false, true);
      expectClassToBe(DayState.IN_SELECTION);
    })

    it('should update on input change', () => {
      setSpiesReturnAndUpdate(true, false, false);

      isSelectedSpy.and.returnValue(true);
      selectClass.ngOnChanges();

      expectClassToBe(DayState.SELECTED);
    })

    it('should update when constraints change', () => {
      setSpiesReturnAndUpdate(true, false, false);

      emitConstraintChange(false);

      expectClassToBe(DayState.INVALID);
    })

    it('should update when selection changes', () => {
      setSpiesReturnAndUpdate(true, false, false);

      emitSelectionChange(true, false);

      expectClassToBe(DayState.SELECTED);
    })

    it('selection change shouldn\'t affect invalid state', () => {
      setSpiesReturnAndUpdate(false, false, false);

      emitSelectionChange(true, false);

      expectClassToBe(DayState.INVALID);
    })

    it('should update when constraint then selection changes', () => {
      setSpiesReturnAndUpdate(false, false, false);

      emitConstraintChange(true);
      emitSelectionChange(true, false);

      expectClassToBe(DayState.SELECTED);
    })

    // bug fixed
    it('should update when selection then constraint changes', () => {
      setSpiesReturnAndUpdate(false, false, false);

      emitSelectionChange(true, false);
      emitConstraintChange(true);

      expectClassToBe(DayState.SELECTED);
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
      expectClassToBe(DayState.SELECTED);

      setSpiesReturnAndUpdate(true, false, true);
      expectClassToBe(DayState.IN_SELECTION);
    })

    it('should use custom class name for all states', () => {
      setupInstances({
        valid: '__ok',
        invalid: '__notOk',
        selected: '__isActivated',
        inSelection: '__isPartiallyActivated',
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

class MockSelect extends DatepickerSelect<Date, void> {
  selectionChange = new EventEmitter<Date>();

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
  public select(date: Date) {
    throw new Error('Should not be called');
  }
  public unselect(date: Date) {
    throw new Error('Should not be called');
  }
  public isSelected(date: Date): boolean {
    throw new Error('Should not be called');
  }
  public isInSelection(date: Date): boolean {
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
  selectRootElement(selectorOrNode: any) {
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
