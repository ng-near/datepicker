import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2 as Renderer,
  SimpleChanges
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { DateConstraint } from '../constraint/dateconstraint.directive';
import { DatepickerSelect } from '../selection/base.select';
import { DayDate } from '../utils';

const enum DayState {
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
    @Optional() @Inject(STATE_CLASSES) private stateClasses: StateClassesName | null,
    @Optional() private dateConstraint: DateConstraint,
    private elRef: ElementRef,
    private renderer: Renderer) {

    this.subs.add(
      select.selectionChange.subscribe(() => { this.updateSelection() })
    );

    if (stateClasses !== null) {
      this.getClass = (s: DayState) => stateClasses[s] || s;
    }

    if (dateConstraint !== null) {
      this.getValidityState = () => dateConstraint.isDateValid(this.day) ? DayState.VALID : DayState.INVALID;
      this.subs.add(
        dateConstraint.constraintChange.subscribe( () => { this.updateValidity() })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateFull();
  }

  private getSelectionState() {
    return this.select.isDateSelected(this.day) ? DayState.SELECTED :
      this.select.isDateInSelection(this.day) ? DayState.IN_SELECTION :
      null;
  }

  private updateSelection() {
    if (this.selectState !== DayState.INVALID) {
      const state = this.getValidityState() || DayState.VALID;
      this.updateStateClass(state);
    }
  }

   // validity could have change selection but if so selectionChange will fire
   // so we don't have to handle it
  private updateValidity() {
    const state = this.getValidityState();

    /* when new state is invalid we always update
     * but when new state is valid we only update if it was previously invalid
     *   if state was valid, select or inselection we keep it that way.
     */
    if (state === DayState.INVALID || (this.selectState === DayState.INVALID)) {
      this.updateStateClass(state);
    }
  }

  updateFull() {
    const newState: DayState = this.getSelectionState() || this.getValidityState();

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
