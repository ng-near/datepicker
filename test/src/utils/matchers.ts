import { isSameDay } from '../../../src/utils/utils';

// custom matchers
function iterableEquality<T>(compareFn: (actual: T, expected: T) => boolean) {
  return (actual: Iterable<T>, expected: Iterable<T>) => {

    if ( actual != null && expected != null &&
      typeof actual[Symbol.iterator] === 'function' && typeof expected[Symbol.iterator] === 'function' &&
      (!Array.isArray(actual) || !Array.isArray(expected))
    ) {
      const iterator1 = actual[Symbol.iterator]();
      const iterator2 = expected[Symbol.iterator]();

      let next1: IteratorResult<T>;
      let next2: IteratorResult<T>;

      do {
        next1 = iterator1.next();
        next2 = iterator2.next();

        if (next1.done !== next2.done || !compareFn(next1.value, next2.value)) {
          return false;
        }
      } while (!next1.done && !next2.done)

      return true;
    }
  }
}

const iterableSameDayEquality = iterableEquality<Date>((a, e) => isSameDay(a, e));

function isDate(object: any): object is Date {
  return object instanceof Date;
}

function iterableToString<T>(iterable: Iterable<T>) {
  let str = '( ';
  for (let item of iterable) {
    str += item + ', ';
  }

  return str + ')';
}

const iterableDateMatcher = {

  toBeSameDay: () => ({
    compare(actual: Date | Iterable<Date>, expected: Date | Iterable<Date>) {
      const result: {pass: boolean, message?: string} = { pass: false };

      if (isDate(actual) && isDate(expected)) {
        if (isSameDay(actual, expected)) {
          result.pass = true;
        } else {
          result.message = `Expected ${actual} to be same day as ${expected}.`;
        }
      } else if (!isDate(actual) && !isDate(expected)) {
        if (iterableSameDayEquality(actual, expected)) {
          result.pass = true;
        } else {
          result.message = `Expected ${iterableToString(actual)} to have same days has ${iterableToString(expected)}.`;
        }
      } else {
        result.message = `Values should be both Date or both Iterable<Date>.`;
      }

      return result;
    }
  })
}

// update typings
type Matchers<T> = jasmine.Matchers<T>;

// export {};

declare global {

  namespace jasmine {
    interface DateMatchers extends Matchers<Date> {
      toBeSameDay(expected: Date): boolean;
    }

    interface IterableMatchers<T> extends Matchers<Iterable<T>> {
      toEqual(expected: Iterable<T>): boolean;
    }

    interface IterableDateMatchers extends IterableMatchers<Date> {
      toBeSameDay(expected: Iterable<Date>): boolean;
    }
  }

  function expect(actual: Date): jasmine.DateMatchers;
  function expect(actual: Iterable<Date>): jasmine.IterableDateMatchers;
}

beforeAll(() => {
  // add them to jasmine
  jasmine.addCustomEqualityTester(iterableEquality((a, e) => a === e));
  jasmine.addMatchers(iterableDateMatcher);
})
