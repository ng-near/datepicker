export { DatepickerModule } from './module';

export { DatePicker, pickerProviders } from './pickers/base';
export { SinglePicker } from './pickers/single';
export { MultiPicker } from './pickers/multi';
export { RangePicker, RangePickerType, DetectStrategyFn, RangeDate } from './pickers/range';

export { DateValidators } from './validator/validators';
export { MinDateValidator, MinDateConstraint, MinDate,
  MaxDateValidator, MaxDateConstraint, MaxDate,
  DisabledDatesValidator, DisabledDatesConstraint, DisabledDates,
  NotWeekendDateValidator, NotWeekendDateConstraint, NotWeekendDate,
  DateConstraint } from './validator/directives';

export { StaticForOf } from './utils/staticfor';
export { NameValue, DayNames, MonthNames, Years, Days, IsMonth, IsToday } from './display/calendar.pipes';
export * from './display/iso.pipes';

export { StateClass, STATE_CLASSES } from './display/stateclass';

export { DateMonths } from './utils/date.months';
export * from './utils/utils';

export { Today } from './utils/today';

export { SimpleDatepickerModule } from './datepickers/simple/simple.datepicker';
