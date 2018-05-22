import { CommonModule, FormStyle, getLocaleDayNames, TranslationWidth } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID, NgModule } from '@angular/core';

import { DatepickerModule } from '../../module';
import { ensureMonthDate } from '../../utils/utils';

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
        <span *ngFor="let wd of dayNames">{{ wd }}</span>
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

  dayNames: string[];

  @Input() months: Date[] = [ensureMonthDate()];

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.dayNames = getLocaleDayNames(locale, FormStyle.Standalone, TranslationWidth.Narrow)
  }

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
