import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgForm } from '@angular/forms';

import { DateConstraintFn, DateConstraints, newMonthDate, RangeDate } from 'ng-imbadatepicker';

@Component({
  selector: 'demo-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  singleSelectDate: Date;
  multiSelectDate: Date[];
  rangeSelectDate: RangeDate;

  months: Date[];

  minDateConstraint: DateConstraintFn;
  maxDateConstraint: DateConstraintFn;
  invalidDateConstraint: DateConstraintFn;
  invalidateWeekendConstraint = DateConstraints.InvalidateWeekend;

  showInputDP = false;
  inputDp = null;

  constructor() {
    const currentMonth = newMonthDate();

    this.singleSelectDate = new Date();
    this.multiSelectDate = [
      this.newDayDate(2),
      this.newDayDate(4),
      this.newDayDate(6)
    ];

    this.rangeSelectDate = {
      start: this.newDayDate(2),
      end: this.newDayDate(5)
    }

    const nextMonth = newMonthDate();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.months = [currentMonth, nextMonth];

    this.minDateConstraint = DateConstraints.minDate(this.newDayDate(5));
    this.maxDateConstraint = DateConstraints.maxDate(this.newDayDate(25));

    this.invalidDateConstraint = DateConstraints.invalidDates([
      this.newDayDate(1), this.newDayDate(3), this.newDayDate(9), this.newDayDate(12)
    ]);
  }

  private newDayDate(day: number) {
    const date = new Date();
    date.setDate(day);
    date.setHours(0, 0, 0, 0);

    return date;
  }

  parseDate(dateStr: string) {
    if (dateStr.length < 11)
      return null;

    return new Date(dateStr);
  }
}

/*
    date is {{ date1 | momentFormat }}
    <datepicker-ionic expanded="true" opened="true" [(ngModel)]="date1" singleSelect [minDate]="minDate"></datepicker-ionic>


    <div *showErrors="let errors = errors; correctors:corr">
      {{ errors }}
    </div>
    <div groupInput>
      <input type="text" correctors maxInt="31" #corr=correctors>/<input type="text" correctors maxInt="12">/<input type="text" correctors maxInt="9999">
    </div>
*/
