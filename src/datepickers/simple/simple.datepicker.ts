import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

import { DatepickerModule } from '../../module';
import { DatePicker } from '../../pickers/base';
import { DateMonths } from '../../utils/date.months';
import { ensureMonthDate } from '../../utils/utils';

@Component({
  selector: 'simple-datepicker',
  template: `
    <div class="month" *staticFor="let month of months; index as i">
      <div class="header">
        <button *ngIf="index === 0" (click)="months = months.shiftMonth(-1)">&lt;</button>
        <span>{{ month | date: 'MMMM y' }}</span>
        <button *ngIf="index === months.size - 1" (click)="months = months.shiftMonth(1)">&gt;</button>
      </div>
      <div class="weekNames">
        <span *staticFor="let wd of 'short' | dayNames">{{ wd }}</span>
      </div>
      <div class="days">
        <span *simpleFor="let d of month | days: true"
              (mousedown)="picker.pick(d)"
              [selectClass]="d"
              [class.isToday]="d | isToday"
              [class.currMonth]="d | isMonth: month">
          {{ d.getDate() }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .month {
      display: inline-block;
      width: 14em; }

    .header {
      display: flex;
      justify-content: space-between;
      padding: .5em 0; }
      .header   span {
        margin: auto; }

    .weekNames   span {
      display: inline-block;
      width: 2.5em;
      font-size: 0.8em;
      line-height: 1.2;
      text-align: center; }

    .days   span {
      display: inline-block;
      width: 2em;
      height: 2em;
      line-height: 2em;
      text-align: center;
      box-sizing: border-box; }
      .days   span.disabled {
        pointer-events: none; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleDatepicker {

  constructor(public picker: DatePicker<any>) { }

  @Input() months = new DateMonths(ensureMonthDate());

}

@NgModule({
  imports: [
    CommonModule,
    DatepickerModule
  ],
  declarations: [
    SimpleDatepicker
  ],
  exports: [
    SimpleDatepicker,
    DatepickerModule
  ]
})
export class SimpleDatepickerModule { }
