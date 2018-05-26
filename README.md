# @ng-near/datepicker

While this lib is named **ng-near/datepicker** and we provide some datepicker components, the main goal of this lib is to provide a toolset so you can easily build your own datepicker like you've dreamt of it for so long.


Here is the code for a simple datepicker :

```html
<div singleSelect #selector="selector">
  <div class="header">
    <button (click)="calendar = calendar.shiftMonth(-1)">prev</button>
    <span>{{ calendar.month | date: 'MMMM y' }}</span>
    <button (click)="calendar = calendar.shiftMonth(1)">next</button>
  </div>
  <span *staticFor="let wd for 'short' | dayNames">{{ wd }}</span>
  <div class="days">
    <span *staticFor="let d of calendar.month | days"
          (click)="selector.selectDate(d)"
          [selectClass]="d"
          [class.isToday]="d | isToday"
          [class.currMonth]="d | isMonth: month">
      {{ d.getDate() }}
    </span>
  </div>
</div>
```
```ts
export class MyDatepicker {
  calendar = new DateMonths(ensureMonthDate());
}
```

As you can see, this relies essentially on composition of pipes and injection (hidden in that example). This path allows you to compose your datepicker using only the bricks you need and nothing more. After a good tree shaking you should end up with a datepicker that perfectly matches your needs with minimal code, every unused will be pruned.

## Version

API shouldn't be considered stable until we reach a major version.
So for the moment all versions are under 0.5.x for Angular 5 and 0.6.x for Angular 6.

Once we reach stability, major version will match with Angular (5.x and 6.x).

## Demonstration

(old using previous API, currently working on new demo)

[http://imbasoft.github.io/ng-imbaDatepicker](http://imbasoft.github.io/ng-imbaDatepicker)

## Installation:

`npm install @ng-near/datepicker`
or
`yarn add @ng-near/datepicker`

## Documentation

Docs will be available on github wiki (Work In Progress);

## Contribution
If you find a bug you can open an issue but if you have time to submit a PR including a failling test to express that bug that would be really awesome.
All contributions are welcome, use issue for design discussion and pull request for implementation proposal.

## Support
We have a gitter room for support https://gitter.om/ng-near/Lobby.
You can also fill an issue for support request ( this may change in the future if it becomes out of hand).

## RoadMap

- Stable API
- Improve example page, text description, styling, code preview... (any help appreciated :) )
- Possibility to leverage date lib like momentjs or datefns if present.