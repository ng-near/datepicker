import { Directive, ElementRef, Inject, InjectionToken, Input, OnChanges, OnDestroy, Optional, Renderer2 as Renderer } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { DatepickerSelect } from '../selection/base.select';
import { DayDate } from '../utils/utils';
import { DateConstraint } from '../validator/directives';

export const enum DayState {
  INVALID = 'invalid',
  VALID = 'valid',
  IN_SELECTION = 'inSelection',
  SELECTED = 'selected',
};

export interface StateClassesName {
  invalid?: string;
  valid?: string;
  inSelection?: string;
  selected?: string;
}

export const STATE_CLASSES = new InjectionToken<StateClassesName>('');

@Directive({
  selector: '[selectClass]'
})
export class SelectClass implements OnChanges, OnDestroy {

  @Input('selectClass')
  day: DayDate;

  private getClass: (s: DayState) => string = s => s;
  private getValidityState: () => DayState.VALID | DayState.INVALID = () => DayState.VALID;

  private selectState: DayState;

  private subs = new Subscription();

  constructor (
    private select: DatepickerSelect<any>,
    @Optional() @Inject(STATE_CLASSES) stateClasses: StateClassesName | null,
    @Optional() dateConstraint: DateConstraint,
    private elRef: ElementRef,
    private renderer: Renderer) {

    this.subs.add(
      select.selectionChange.subscribe(() => { this.updateSelection() })
    );

    if (stateClasses !== null) {
      this.getClass = (s: DayState) => stateClasses[s] || s;
    }

    if (dateConstraint !== null) {
      this.getValidityState = () => dateConstraint.validate(this.day) === null ? DayState.VALID : DayState.INVALID;
      this.subs.add(
        dateConstraint.constraintChange.subscribe( () => { this.updateValidity() })
      );
    }
  }

  ngOnChanges() {
    this.updateFull();
  }

  private getSelectionState() {
    return this.select.isSelected(this.day) ? DayState.SELECTED :
      this.select.isInSelection(this.day) ? DayState.IN_SELECTION :
      DayState.VALID;
  }

  private updateSelection() {
    if (this.selectState !== DayState.INVALID) {
      this.updateStateClass(this.getSelectionState());
    }
  }

  private updateValidity() {
    const state = this.getValidityState();

    /* when new state is invalid we always update */
    if (state === DayState.INVALID) {
      this.updateStateClass(state);
    /* when new state is valid we only update if it was previously invalid
     *   if state was valid, selected or in selection we keep it that way.
     */
    } else if (this.selectState === DayState.INVALID) {
      this.updateStateClass(this.getSelectionState());
    }
  }

  private updateFull() {
    let newState: DayState = this.getValidityState();
    if (newState === DayState.VALID) {
      newState = this.getSelectionState();
    }

    this.updateStateClass(newState);
  }


  private updateStateClass(state: DayState) {
    if (state !== this.selectState) {
      this.renderer.addClass(this.elRef.nativeElement, this.getClass(state));
      this.renderer.removeClass(this.elRef.nativeElement, this.getClass(this.selectState));

      this.selectState = state;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
