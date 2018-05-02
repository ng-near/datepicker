import { Directive, EmbeddedViewRef, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';

export interface ImplicitContext<T> {
  index: number;
  $implicit: T;
}

@Directive({
  selector: '[simpleFor], [simpleForOf]',
})
export class SimpleForOf<T> implements OnChanges {

  @Input()
  simpleForOf: Iterable<T>;

  constructor(private viewContainer: ViewContainerRef, private template: TemplateRef<ImplicitContext<T>>) { }

  ngOnChanges() {
    const items = this.simpleForOf;

    const length = this.viewContainer.length;

    let it = items[Symbol.iterator]();

    let i = 0;
    let result: IteratorResult<T>;

    // update existing
    while ((result = it.next()).done !== true && i < length) {
      const context = (<EmbeddedViewRef<ImplicitContext<T>>>this.viewContainer.get(i)).context;
      context.index = i;
      context.$implicit = result.value;
      i++;
    }

    if (result.done !== true) {
      // add new
      do {
        this.viewContainer.createEmbeddedView(this.template, {$implicit: result.value, index: i});
        i++;
      } while ((result = it.next()).done !== true)
    } else {
      // remove extraneous
      for (; i < length; i++) {
        this.viewContainer.remove(i);
      }
    }
  }
}
