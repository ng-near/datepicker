
import { registerLocaleData } from '@angular/common';

import { DateValidatorFn } from '../../../src/validator/model';
import { DateValidators } from '../../../src/validator/validators';
import { localeArAE } from './locale.ar-AE';

describe('Constraints', () => {
  describe('minDate', () => {
    let minDate: DateValidatorFn;

    beforeEach(() => {
      minDate = DateValidators.minDate(new Date(2000, 0, 1));
    })

    it('should validate date after', () => {
      expect(minDate(new Date(2000, 0, 2))).toBe(null);
    })

    it('should invalidate date before', () => {
      expect(minDate(new Date(1999, 0, 1))).not.toBe(null);
    })

    it('should validate same date', () => {
      expect(minDate(new Date(2000, 0, 1))).toBe(null);
    })

    it('should normalize minDate to a day (with time set to 0)', () => {
      minDate = DateValidators.minDate(new Date(2000, 0, 1, 10, 20));

      expect(minDate(new Date(2000, 0, 1))).toBe(null);
    })
  })

  describe('maxDate', () => {
    let maxDate: DateValidatorFn;

    beforeEach(() => {
      maxDate = DateValidators.maxDate(new Date(2000, 0, 1));
    })

    it('should validate date before', () => {
      expect(maxDate(new Date(1999, 0, 1))).toBe(null);
    })

    it('should invalidate date after', () => {
      expect(maxDate(new Date(2000, 0, 2))).not.toBe(null);
    })

    it('should validate same date', () => {
      expect(maxDate(new Date(2000, 0, 1))).toBe(null);
    })

    it('should normalize maxDate to a day (with time set to 0)', () => {
      maxDate = DateValidators.maxDate(new Date(2000, 0, 1, 10, 20));

      expect(maxDate(new Date(2000, 0, 1))).toBe(null);
    })
  })

  describe('disabledDates', () => {

    it('should work with empty array', () => {
      const disabledDates = DateValidators.disabledDates([]);

      expect(disabledDates(new Date(0))).toBe(null);
      expect(disabledDates(new Date(2000, 0))).toBe(null);
    })

    it('should invalidate dates disabled', () => {
      const disabledDates = DateValidators.disabledDates([
        new Date(2000, 1, 0),
        new Date(2000, 2, 0),
      ]);

      expect(disabledDates(new Date(2000, 1, 0))).not.toBe(null);
      expect(disabledDates(new Date(2000, 2, 0))).not.toBe(null);
    })

    it('should validate dates not disabled', () => {
      const disabledDates = DateValidators.disabledDates([
        new Date(2000, 1, 0),
        new Date(2000, 2, 0),
      ]);

      expect(disabledDates(new Date(2000, 1, 1))).toBe(null);
      expect(disabledDates(new Date(2000, 2, 1))).toBe(null);
    })

    it('should invalidate date even if time is not the same', () => {
      const disabledDates = DateValidators.disabledDates([
        new Date(2000, 1, 0, 10, 20),
      ]);

      expect(disabledDates(new Date(2000, 1, 0, 3))).not.toBe(null);
    })
  })

  describe('notWeekend', () => {
    it('should invalidate week-end dates', () => {
      const notWeekend = DateValidators.notWeekend('en-US');

      expect(notWeekend(new Date(2000, 0, 1))).not.toBe(null);
      expect(notWeekend(new Date(2000, 0, 2))).not.toBe(null);
    })

    it('should validate not week-end dates', () => {
      const notWeekend = DateValidators.notWeekend('en-US');

      expect(notWeekend(new Date(2000, 0, 3))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 4))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 5))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 6))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 7))).toBe(null);
    })

    it('should work with a locale where first weekend day number is smaller than last weekend day number', () => {
      registerLocaleData(localeArAE);

      const notWeekend = DateValidators.notWeekend('ar-AE');

      expect(notWeekend(new Date(2000, 0, 7))).not.toBe(null);
      expect(notWeekend(new Date(2000, 0, 8))).not.toBe(null);

      expect(notWeekend(new Date(2000, 0, 9))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 10))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 11))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 12))).toBe(null);
      expect(notWeekend(new Date(2000, 0, 13))).toBe(null);
    })
  })
})
