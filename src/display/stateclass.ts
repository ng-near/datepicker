import { Directive, ElementRef, Inject, InjectionToken, Input, OnChanges, OnDestroy, Optional, Renderer2 as Renderer } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { DatePicker } from '../pickers/base';
import { DayDate } from '../utils/utils';
import { DateConstraint } from '../validator/directives';

export const enum DayState {
  INVALID = 'invalid',
  VALID = 'valid',
  IN_PICK = 'inPick',
  PICKED = 'picked',
};

export interface StateClassesName {
  invalid?: string;
  valid?: string;
  inPick?: string;
  picked?: string;
}

export const STATE_CLASSES = new InjectionToken<StateClassesName>('');

@Directive({
  selector: '[stateClass]'
})
export class StateClass implements OnChanges, OnDestroy {

  @Input('stateClass')
  day: DayDate;

  private getClass: (s: DayState) => string = s => s;
  private getValidityState: () => DayState.VALID | DayState.INVALID = () => DayState.VALID;

  private state: DayState;

  private subs = new Subscription();

  constructor (
    private picker: DatePicker<any>,
    @Optional() @Inject(STATE_CLASSES) stateClasses: StateClassesName | null,
    @Optional() dateConstraint: DateConstraint,
    private elRef: ElementRef,
    private renderer: Renderer) {

    this.subs.add(
      picker.pickChange.subscribe(() => { this.updateSelection() })
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
    return this.picker.isPicked(this.day) ? DayState.PICKED :
      this.picker.isInPick(this.day) ? DayState.IN_PICK :
      DayState.VALID;
  }

  private updateSelection() {
    if (this.state !== DayState.INVALID) {
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
    } else if (this.state === DayState.INVALID) {
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
    if (state !== this.state) {
      this.renderer.addClass(this.elRef.nativeElement, this.getClass(state));
      this.renderer.removeClass(this.elRef.nativeElement, this.getClass(this.state));

      this.state = state;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
