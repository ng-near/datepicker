import { Component, Input, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { newMonthDate } from '../../utils';

// TODO improve build system to automatically inline template and style from url.

@Component({
  selector: 'simple-datepicker',
  template: `
    <div class="month" *forMonth="let month of months; first as first; last as last; selector as selector; navigator as navigator">
      <div class="header">
        <button *ngIf="first" (click)="months = navigator.moveMonth(-1)">&lt;</button>
        <span>{{ month | date: 'MMMM y' }}</span>
        <button *ngIf="last" (click)="months = navigator.moveMonth(1)">&gt;</button>
      </div>
      <div class="weekNames">
        <span *forWeekdayNames="let wd for 'short'">{{ wd }}</span>
      </div>
      <div class="days">
        <span *forMonthday="let d of month; sixWeeks: true; today as today; currentMonth as currMonth"
              (mousedown)="selector.selectDate(d)"
              [selectClass]="d"
              [class.isToday]="today"
              [class.currMonth]="currMonth">
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

  @Input() months: Date[] = [newMonthDate()];

}

import { DatepickerModule } from '../../module';

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
