import { Directive, Input, ElementRef, Renderer2 as Renderer, OnChanges, SimpleChanges, OnDestroy, Optional } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DatepickerSelect } from '../selection/base.select';
import { DateConstraint } from '../constraint/dateconstraint.directive';
import { DayDate } from '../utils';

// string enum may help here (ts > 2.4)
type DayState = 'invalid' | 'valid' | 'inSelection' | 'selected';

export interface StateClassesName {
  invalid: string;
  valid: string;
  inSelection: string;
  selected: string;
}

@Directive({
  selector: '[selectClass]'
})
export class SelectClass implements OnChanges, OnDestroy {

  @Input('selectClass') day: DayDate;

  @Input()
  private classesName: Partial<StateClassesName> = {};

  private selectState: DayState;

  private subs = new Subscription();

  constructor (
    private select: DatepickerSelect<any>,
    @Optional() private dateConstraint: DateConstraint,
    private elRef: ElementRef,
    private renderer: Renderer) {

    this.subs
      .add( select.selectionChange.subscribe(() => { this.updateStateClass() }) );

    if (dateConstraint !== null) {
      this.subs.add( dateConstraint.constraintChange.subscribe( () => { this.updateStateClass() }) )
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('day' in changes) {
      this.updateStateClass();
    }
  }

  updateStateClass() {
    const newState: DayState =
      this.select.isDateSelected(this.day) ?    'selected' :
      this.select.isDateInSelection(this.day) ? 'inSelection' :
      this.dateConstraint === null || this.dateConstraint.isDateValid(this.day) ? 'valid' :
                                  'invalid' ;

    if (newState !== this.selectState ) {
      this.setClass(this.selectState, false);
      this.setClass(newState, true);
    }

    this.selectState = newState;
  }

  private setClass(name: DayState, add: boolean) {
    if (add === true)
      this.renderer.addClass(this.elRef.nativeElement, this.classesName[ name ] || name);
    else
      this.renderer.removeClass(this.elRef.nativeElement, this.classesName[ name ] || name);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
