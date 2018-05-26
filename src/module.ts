import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { DayNames, Days, IsMonth, IsToday, MonthNames, Years } from './display/calendar.pipes';
import { ISODays, ISOWeeks } from './display/iso.pipes';
import { StateClass } from './display/stateclass';
import { MultiPicker } from './pickers/multi';
import { RangePicker } from './pickers/range';
import { SinglePicker } from './pickers/single';
import { StaticForOf } from './utils/staticfor';
import { Today } from './utils/today';
import { convertDate } from './utils/utils';
import { VALIDATOR_DIRECTIVES } from './validator/directives';
import { DATE_CONVERTER } from './validator/model';

const decl_exports = [
  SinglePicker,
  MultiPicker,
  RangePicker,

  ...VALIDATOR_DIRECTIVES,

  StaticForOf,

  DayNames, MonthNames, Years, Days, IsMonth, IsToday,
  ISOWeeks, ISODays,

  StateClass,
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
