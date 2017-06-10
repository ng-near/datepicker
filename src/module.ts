import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SingleSelect } from './selection/single.select';
import { MultiSelect } from './selection/multi.select';
import { RangeSelect } from './selection/range.select';

import { DateConstraint } from './constraint/dateconstraint.directive';

import { ForMonthOf } from './display/formonth';
import { ForWeekdayNamesFor } from './display/forweekdaynames';
import { ForMonthday } from './display/formonthday';
import { ForMonthNamesFor } from './display/formonthnames';

import { SelectClass } from './display/selectclass';


import { TodayProvider } from './today';

const decl_exports = [
  SingleSelect,
  MultiSelect,
  RangeSelect,

  DateConstraint,

  ForMonthOf,
  ForWeekdayNamesFor,
  ForMonthday,
  ForMonthNamesFor,

  SelectClass
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: decl_exports,
  providers: [TodayProvider],
  exports: [
    ...decl_exports,
    DatePipe
  ]
})
export class DatepickerModule { }
