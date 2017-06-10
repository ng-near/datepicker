import { Component, Inject, LOCALE_ID } from '@angular/core';

import { newMonthDate } from 'ng-imbadatepicker';

@Component({
  selector: 'select-datepicker',
  templateUrl: './select.datepicker.html',
  styleUrls: ['./select.datepicker.scss']
})
export class SelectDatepicker {

  months = [new Date()];
  years: number[];

  constructor(@Inject(LOCALE_ID) private locale: string) {
    const currentYear = new Date().getFullYear();

    this.years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.years.push(i);
    }
  }

}
