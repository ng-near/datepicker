import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleForOf } from '../../../src/utils/simplefor';

@Component({
  selector: 'test-cmp',
  template: `
    <span *simpleFor="let item of items">{{item}}</span>
  `
})
// @ts-ignore
class TestComponent {
  items: Iterable<any> = [1, 2];
}

function createTestComponent(): ComponentFixture<TestComponent> {
  return TestBed.createComponent(TestComponent);
}

function getChildrenElements(debugEl: DebugElement) {
  return debugEl.children.map(c => c.nativeElement);
}

// TODO add test for index in context

describe('SimpleForOf', () => {
  let fixture: ComponentFixture<any>;
  let cmp: TestComponent;

  beforeEach(async(() =>
    TestBed.configureTestingModule({
      declarations: [TestComponent, SimpleForOf],
    })
  ))

  beforeEach(() => {
    fixture = createTestComponent();
    cmp = fixture.componentInstance;
  })

  afterEach(() => { fixture = null as any; });



  function updateItems(items: any[]) {
    const prevChildrenElements = getChildrenElements(fixture.debugElement);

    cmp.items = items;

    const newChildrenElements = getChildrenElements(fixture.debugElement);

    return {
      prevChildrenElements,
      newChildrenElements,
    };
  }

  function expectChildren(expectedChildren: string[]) {
    fixture.detectChanges();

    const children = getChildrenElements(fixture.debugElement)
      .map(c => c.textContent);

    expect(children).toEqual(expectedChildren);
  }

  it('should reflect initial elements', async(() => {
    expectChildren(['1', '2']);
  }))

  it('should update elements value (reusing same elements)', async(() => {
    const { prevChildrenElements, newChildrenElements } = updateItems([3, 4]);

    expectChildren(['3', '4']);
    expect(prevChildrenElements).toEqual(newChildrenElements);
  }))

  it('sshould reflect update and add new elements', async(() => {
    const { prevChildrenElements, newChildrenElements } = updateItems([1, 2, 3, 4]);

    expectChildren(['1', '2', '3', '4']);
    expect(prevChildrenElements).toEqual(newChildrenElements.slice(0, 2));
  }))

  it('should reflect update and remove extraneous elements', async(() => {
    const { prevChildrenElements, newChildrenElements } = updateItems([1]);

    expectChildren(['1']);
    expect(prevChildrenElements.slice(0, 1)).toEqual(newChildrenElements);
  }))

  it('should work with any iterable', async(() => {
    cmp.items = 'abc';
    expectChildren(['a', 'b', 'c']);

    cmp.items = new Set([1, 2, 3]);
    expectChildren(['1', '2', '3']);
  }))
})
