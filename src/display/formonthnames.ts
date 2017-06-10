import { Directive, Inject, TemplateRef, ViewContainerRef, LOCALE_ID } from '@angular/core';
import { ForName } from './forname.base';

@Directive({
  selector: '[forMonthNames][forMonthNamesFor]',
  inputs: ['format:forMonthNamesFor']
})
export class ForMonthNamesFor extends ForName {

  protected readonly formatProperty: 'month' = 'month';

  constructor(@Inject(LOCALE_ID) locale: string,
    template: TemplateRef<any>,
    viewContainer: ViewContainerRef) {
      super(locale, template, viewContainer);
    }

  iterate(cb: (date: Date, index: number) => void) {
    for (let i = 0; i < 12; i++)
      cb(new Date(1970, i, 1), i);
  }
}
