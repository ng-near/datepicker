export { DatepickerModule } from './module';

export { DatepickerSelect, selectProviders } from './selection/base.select';
export { SingleSelect } from './selection/single.select';
export { MultiSelect } from './selection/multi.select';
export { RangeSelect, RangeSelectType, DetectStrategyFn, RangeDate } from './selection/range.select';

export { DateValidators } from './validator/validators';
export { MinDateValidator, MinDateConstraint, MinDate,
  MaxDateValidator, MaxDateConstraint, MaxDate,
  DisabledDatesValidator, DisabledDatesConstraint, DisabledDates,
  NotWeekendDateValidator, NotWeekendDateConstraint, NotWeekendDate,
  DateConstraint } from './validator/directives';

export { StaticForOf } from './utils/staticfor';
export { NameValue, DayNames, MonthNames, Years, Days, IsMonth, IsToday } from './display/calendar.pipes';
export * from './display/iso.pipes';

export { SelectClass, STATE_CLASSES } from './display/selectclass';

export { DateMonths } from './utils/date.months';
export * from './utils/utils';

export { Today } from './utils/today';

export { SimpleDatepickerModule } from './datepickers/simple/simple.datepicker';
