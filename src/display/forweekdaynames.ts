import { Directive, LOCALE_ID, TemplateRef, Inject, ViewContainerRef } from '@angular/core';
import { ForName } from './forname.base';

// TODO first weekDay

@Directive({
  selector: '[forWeekdayNames][forWeekdayNamesFor]',
  inputs: ['format:forWeekdayNamesFor']
})
export class ForWeekdayNamesFor extends ForName {

  protected readonly formatProperty: 'weekday' = 'weekday';

  constructor(@Inject(LOCALE_ID) locale: string,
    template: TemplateRef<any>,
    viewContainer: ViewContainerRef) {
      super(locale, template, viewContainer);
    }

  iterate(cb: (date: Date, index: number) => void) {
    for (let i = 0; i < 7; i++)
      cb(new Date(2007, 0, i + 1), i);
  }
}
