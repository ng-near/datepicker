import { Directive, Input, OnChanges, ViewContainerRef, TemplateRef, EmbeddedViewRef } from '@angular/core';

export interface ImplicitContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[simpleFor], [simpleForOf]',
})
export class SimpleForOf<T> implements OnChanges {

  @Input()
  simpleForOf: T[];

  constructor(private viewContainer: ViewContainerRef, private template: TemplateRef<ImplicitContext<T>>) { }

  ngOnChanges() {
    const items = this.simpleForOf;

    const length = this.viewContainer.length;
    const newLength = items.length;

    // update existings
    for (let i = 0, l = Math.min(length, newLength); i < l; i++) {
      (<EmbeddedViewRef<ImplicitContext<T>>>this.viewContainer.get(i)).context.$implicit = items[i];
    }

    // add new
    for (let i = length; i < newLength; i++) {
      this.viewContainer.createEmbeddedView(this.template, {$implicit: items[i]});
    }

    // remove extraneous
    for (let i = length - 1; i >= newLength; i--) {
      this.viewContainer.remove(i);
    }
  }
}
