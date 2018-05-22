import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DayNames, Days, IsMonth, IsToday, MonthNames, Years } from './display/calendar.pipes';
import { ISODays, ISOWeeks } from './display/iso.pipes';
import { SelectClass } from './display/selectclass';
import { convertDate } from './index';
import { MultiSelect } from './selection/multi.select';
import { RangeSelect } from './selection/range.select';
import { SingleSelect } from './selection/single.select';
import { StaticForOf } from './utils/staticfor';
import { Today } from './utils/today';
import { VALIDATOR_DIRECTIVES } from './validator/directives';
import { DATE_CONVERTER } from './validator/model';

const decl_exports = [
  SingleSelect,
  MultiSelect,
  RangeSelect,

  ...VALIDATOR_DIRECTIVES,

  StaticForOf,

  DayNames, MonthNames, Years, Days, IsMonth, IsToday,
  ISOWeeks, ISODays,

  SelectClass,
];

export interface DatepickerConfig {
  convertDate?: (v: any) => Date;
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: decl_exports,
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
        Today,
        { provide: DATE_CONVERTER, useValue: (config && config.convertDate) || convertDate }
      ]
    };
  }
}
