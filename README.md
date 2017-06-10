# ng-imbaDatepicker

**ng-imbaDatepicker** was first meant to be a flexible datepicker component for Angular but it started to grow and became really complicated.
So now our main goal is to provide a toolset so you can easily build yourself your own datepicker like you've dreamt of it. But we'll still provide some pre-build component that could be enough for most use cases.

You can either write away a datepicker direcly on your template or create a reusable component
Here is the code for a simple datepicker :

```
<div *forMonth="let month of months; first as first; last as last; selector as selector; navigator as nav" singleSelect>
  <div class="header">
    <button (click)="months = nav.moveMonth(-1, month)">prev</button>
    <span>{{ month | date: 'MMMM y' }}</span>
    <button (click)="months = nav.moveMonth(1, month)">next</button>
  </div>
  <span *forWeekdayNames="let wd for 'short'">{{ wd }}</span>
  <div class="days">
    <span *forMonthday="let d of month; today as isToday; currentMonth as isCurrMonth"
          (click)="selector.selectDate(d)"
          [selectClass]="d"
          [class.isToday]="isToday"
          [class.currMonth]="isCurrMonth">
      {{ d.getDate() }}
    </span>
  </div>
</div>
```
```
export class MyDatepicker {
  months: Date[] = [newMonthDate()];
}
```

As you can see ng-imbaDatepicker relies essentially on composition of directives and injection (hidden in that example). This path allows you compose your datepicker using only the bricks you need and nothing more. After a good tree shaking you should end up with a datepicker that perfectly matches your needs with minimal code.

API shouldn't be considered stable until we reach version 1.0.0.

/!\ We strongly recommends the use of immutable data. For changes, you should always create new object (Date, Array...) instead of mutating the existing one.


## Demo

[http://imbasoft.github.io/ng-imbaDatepicker](http://imbasoft.github.io/ng-imbaDatepicker)

## Installation:

`npm install ng-imbadatepicker`

## Usage

You just need to import `DatepickerModule` and you can start working with the directives.
```
import { DatepickerModule } from 'ng-imbadatepicker';

@NgModule({
  imports: [
    DatepickerModule
  ],
  declarations: [
    MyDatepicker
  ]
})
```

## Contribution
All contribution are welcome, use issue for design discussion and pull request for implementation proposal.
I'm currently looking for contributors to build datepicker for most common ui library like bootstrap, material design ...

## Support
You can fill an issue for support request, this may change in the future is it becomes out of hand.
You can also find me on [gitter](https//gitter.im/ghetolay), I'll try my best if I have time.

## Documentation
### Selection

A datepicker can only have one select directive responsible to the date selection and the state of days date (I'll split that). That directive will be injected into the others so it just need to be available on the injector tree, it can be define on the datepicker element or in any parent element. /!\ small warning : since there no good way yet to restrict injection if you happen to nest datepickers (wtf?) you could come into trouble but you could also take advantage of it like in the (multiple sync datepicker)[] example.

#### Common properties to all SelectDirective
**Output**: `dateChange: EventEmitter<T>`  
Output that emit the new selection when the selection changes.

**ControlValueAccesor**: All SelectDirective implements `ControlValueAccessor` so you can include it in a form and use any of the form directive on it like `ngModel` or `formControlName`.

You can inject any of the select directive extending `DatepickerSelect` like that :
`constructor (selectDirective: DatePickerSelect<any>)`

#### SingleSelect
**class**: `SingleSelect`  
**selector**: `[singleSelect]`  
**usage example**: `<div singleSelect>`  

This directive will select a single date and returns it as a `Date` object.
Selecting valid date will select it and discard any previously selected date.
Re-selecting a selected date will unselected it.

#### MultiSelect
**class**: `MultiSelect`  
**selector**: '[multiSelect]'  
**input**: `multiSelect` Define the limit number of dates to select.  
**usage example**: `<div multiSelect="2">`  

This directive will select multiple dates and returns it as an array of date `Date[]`.
Selecting valid dates will add them until we reach the limit.
Once the limit is reached you can't select any more date until you unselect at least one.
Re-selecting a selected date will unselected it.

#### RangeSelect
**class**: `RangeSelect`  
**selector**: `[rangeSelect]`  
**usage example**: `<div rangeSelect>`  

This directive will select 2 valid date to form a range and return a [`RangeDate`]() object.
Once you have 2 date selected if you select a third date, the closest between the start date and the end date will be replaced.
Re-selecting a selected date will unselected it.

### Date Constraints
Date Constraints define which date can be selected.
They works closely to how form validators works, still the usage is a bit different as there isn't a directive per validator but just a single directive :
**class**: `DateConstraint`  
**selector**: `[dateConstraint]`  
**input**: `dateConstraint` take one or an array of `DateConstraintFn`. You must use an **immutable array** so we can detect changes properly.  
**output**: `constraintChange` Fires when input changes (was meant as an internal thing only but why not make it an @Ouput too).  
**usage example**:
```
<div singleSelect dateConstraint="constraints">
```
```
export class MyDatepicker {
  /* we need to define a property with the constraints to pass them to the directive.
   * this could be seen as a flaw of the single directive implementation but most constraints
   * needs a date as parameter and you can't define a date directly on the template anyway.
   */
  constraints = [DateConstraints.minDate(new Date()), DateConstraints.InvalidateWeekend];
}
```

There is currently 4 built-in date constraint :
 - minDate
 - maxDate
 - invalidDates
 - indalidateWeekend

### Display

There is a bunch of directives to help you display your datepicker. They're essentially custom `ngFor` as you can see their name starting with `forXXX`.

#### ForMonth
**class**: `ForMonthOf`  
**selector**: `[forMonth]`  
**input**: `of` an array of dates.  
**context**: `$implicit: Date`, `selector: DatepickerSelect`, `navigator: DateNavigator`, `index: number`, `count: number`, `first: boolean`, `last: boolean`, `odd: boolean`, `even: boolean`  
**usage example**: `<div *forMonth="let month of months; nav as navigator; selector as selector;">`  

This directive will through an array of Date reprenting months and inject a template per date in the array. Compared to `ngFor`, that directive only works with array at the moment, will track by month and offers a bigger context.

`selector` will be the select directive you've defined. We inject it and share it via context so you don't need to inject it into your component.
`navigator` see `DateNavigator` below.

##### DateNavigator
**class**: `DateNavigator`  
That is a helper to help you navigate throughout months and enforce immutable data.
It's part of the context returned by `ForMonth` but you can also import it and use it if needed.

All function uses the same pattern : They uses the internal array of month, change one or more month and returns a new array of month. Last argument `monthDate` is optional and defines which date on the array should be changed, if omitted all dates are changed.

`moveMonth(amount: number, monthDate?: Date): Date[]` Change date by shifting them by an amount of month.
`moveYear(amount: number, monthDate?: Date): Date[]` Change date by shifting them by an amount of year.
`toMonth(month: number, monthDate?: Date): Date[]` Change date by setting the month, other fields are preserved. Month must be between 0 and 11 like for `Date`.
`toYear(year: number, monthDate?: Date): Date[]` Change date by by setting the year, other fields are preserved.

#### ForMonthDay
**class**: `ForMonthday`  
**selector**: `[forMonthday]`  
**input**: `of` a date reprensenting a month.  
**input**: *optional* `sixWeek` Define if we should always returns 6 weeks e.g: 42 days keeping the datepicker to a fix height. Otherwise the height is dependent to the month currently displayed. Default is false;  
**context**: `$implicit: Date`, `today: boolean`, `currentMonth: boolean`  
**usage example**: `<span *forMonthday="let day of month; sixWeek: true"; today as isToday; currentMonth as isCurrentMonth>`  

This directive will compute all days on a month including days of previous and next month if necessary to complete first and last week (and to reach 6 weeks if `sixWeeks` is true).

#### ForMonthnames
**class**: `ForMonthNamesFor`  
**selector**: `[forMonthNames]`  
**input**: `for` define the format of the month names. Possible values are `narrow`, `short`, `long`, `numeric` and `2-digit`.  
**context**: `$implicit: string`, `index: number`  
**usage example**: `<span *forMonthNames="let name of 'short'; index as index">`  

This directive will inject a template for each month of the year with names according to the current locale and format.

### forWeekdayNames
**class**: `ForWeekdayNamesFor`  
**selector**: `[forWeekdayNames]`  
**input**: `for` define the format of the weekday names. Possible values are `narrow`, `short` or `long`.  
**context**: `$implicit: string`, `index: number`  
**usage example**: `<span *forWeekdayNames="let name of 'short'; index as index">`  

This directive will inject a template for each day of the week with names according to the current locale and format.

#### SelectClass
**class**: `SelectClass`  
**selector**: `[selectClass]`  
**input**: `selectClass` A date defining a day.  
**input**: `classesName` An object to match a className to a state. The object doesn't need to provide a class name for all state, missing state will use default class name.  
**usage example**:
```
<span [stateClass]="day" [classesNames]="classesNames">
```
```
export class MyDatepicker {
  classesNames = {
    invalid: 'disabled',
    valid: 'enabled',
    inSelection: 'inRange',
    selected: 'active'
  }
}
```

This directive will add a css class to the element according to the state of the day reprensented by the date passed in.
A day is always on one of the 4 state :
 - invalid : That day can't be part of the selection because of a DateConstraint.
 - valid : That day can be selected.
 - inSelection : That day is not directly selected but part of the selection.
 - selected : That day is selected.

Except for invalid, when a state is active all states before it are also active.
For example a selected day is also valid and inSelection.

By default class name will match the state name.

## Built-in Datepicker
### SimpleDatepicker

// TODO

## RoadMap

- Stable API
- Tests, tests, tests
- Internationalization (live not just current locale)
- First week day option for `forWeekdayNames` and `forMonthDay`
- Improve example page, text description, styling, code preview... (any help appreciated :) )