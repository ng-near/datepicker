import { OnInit, OnChanges, ViewContainerRef, TemplateRef, EmbeddedViewRef } from '@angular/core';

export interface ForNameContext {
  index: number;
  $implicit: string;
}

export abstract class ForName implements OnInit, OnChanges {

  protected abstract readonly formatProperty: keyof Intl.DateTimeFormatOptions;

  // TODO numeric and 2-digit doesn't apply for weekday
  format: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';

  constructor(private locale: string,
    private template: TemplateRef<ForNameContext>,
    private viewContainer: ViewContainerRef) { }

  ngOnInit() {
    if (this.viewContainer.length === 0)
      this.updateView();
  }

  ngOnChanges() {
    this.updateView();
  }

  // Iterator and generator when transpiled to es5 generate big code
  // for now we're fine with a simple function and a callback
  abstract iterate(cb: (date: Date, index: number) => void): void;

  get formatter() {
    return new Intl.DateTimeFormat(this.locale, {
      [this.formatProperty]: this.format
    });
  }

  private initView() {
    const dateFormatter = this.formatter;

    this.iterate( (date, index) => {
      this.viewContainer.createEmbeddedView(this.template, {
        index,
        $implicit: dateFormatter.format( date )
      }, index);
    });

    this.updateView = this._updateView;
  }

  private _updateView() {
    const dateFormatter = this.formatter;

    this.iterate( (date, index) => {
      const view = <EmbeddedViewRef<ForNameContext>>this.viewContainer.get(index);
      view.context.$implicit = dateFormatter.format( date );
    });
  }

  private updateView = this.initView;
}
