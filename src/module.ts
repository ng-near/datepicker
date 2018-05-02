import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ForMonthOf } from './display/formonth';
import { ForMonthday } from './display/formonthday';
import { DayNames, MonthNames, Years } from './display/pipes';
import { SelectClass } from './display/selectclass';
import { convertDate } from './index';
import { MultiSelect } from './selection/multi.select';
import { RangeSelect } from './selection/range.select';
import { SingleSelect } from './selection/single.select';
import { TodayProvider } from './today';
import { SimpleForOf } from './utils/simplefor';
import { VALIDATOR_DIRECTIVES } from './validator/directives';
import { DATE_CONVERTER } from './validator/model';

const decl_exports = [
  SingleSelect,
  MultiSelect,
  RangeSelect,

  ...VALIDATOR_DIRECTIVES,

  SimpleForOf,

  DayNames,
  MonthNames,
  Years,

  ForMonthOf,
  ForMonthday,

  SelectClass
];

export interface DatepickerConfig {
  convertDate?: (v: any) => Date;
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: decl_exports,
  providers: [
    TodayProvider,
  ],
  exports: [
    ...decl_exports,
    DatePipe
  ]
})
export class DatepickerModule {
  static forRoot(config?: DatepickerConfig): ModuleWithProviders {
    return {
      ngModule: DatepickerModule,
      providers: [
        { provide: DATE_CONVERTER, useValue: (config && config.convertDate) || convertDate }
      ]
    };
  }
}
