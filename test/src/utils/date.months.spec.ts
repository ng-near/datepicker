import './matchers';

import { DateMonths } from '../../../src/utils/date.months';

/* When we shift by 0 or make a useless change
 * we don't create a new object and we assert that.
 * TODO Should we always return a new object (not optimal for OnPush) ?
 * If not, should we remove that spec (e.g. it's impl detail) ?
 */

describe('DateMonths', () => {

  it('should contain intial values', () => {
    const dates = [new Date(2017, 5), new Date(2017, 6)];
    const months = new DateMonths(...dates);

    expect(months).toEqual(dates);
  })

  describe('shiftMonth', () => {
    let dates: Date[];
    let months: DateMonths;

    beforeEach(() => {
      dates = [new Date(2017, 5), new Date(2017, 11), new Date(2018, 0)];
      months = new DateMonths(...dates);
    });

    it('should shift all forward', () => {
      const results = months.shiftMonth(1);

      expect(results).toBeSameDay([new Date(2017, 6), new Date(2018, 0), new Date(2018, 1)]);
    })

    it('should shift all backward', () => {
      const results = months.shiftMonth(-2);

      expect(results).toBeSameDay([new Date(2017, 3), new Date(2017, 9), new Date(2017, 10)]);
    })

    it('should shift forward first', () => {
      const results = months.shiftMonth(1, 0);

      expect(results).toBeSameDay([new Date(2017, 6), dates[1], dates[2]]);
    })

    it('should not shift', () => {
      const results = months.shiftMonth(0);

      expect(results).toBe(months);
      expect(results).toEqual(dates);
    })
  })

  describe('shiftYear', () => {
    let dates: Date[];
    let months: DateMonths;

    beforeEach(() => {
      dates = [new Date(2016, 5), new Date(2017, 11), new Date(2018, 0)];
      months = new DateMonths(...dates);
    });

    it('should shift all forward', () => {
      const results = months.shiftYear(1);

      expect(results).toBeSameDay([new Date(2017, 5), new Date(2018, 11), new Date(2019, 0)]);
    })

    it('should shift all backward', () => {
      const results = months.shiftYear(-2);

      expect(results).toBeSameDay([new Date(2014, 5), new Date(2015, 11), new Date(2016, 0)]);
    })

    it('should shift forward first', () => {
      const results = months.shiftYear(1, 0);

      expect(results).toBeSameDay([new Date(2017, 5), dates[1], dates[2]]);
    })

    it('should not shift', () => {
      const results = months.shiftMonth(0);

      expect(results).toBe(months);
      expect(results).toEqual(dates);
    })
  })

  describe('changeMonth', () => {
    let dates: Date[];
    let months: DateMonths;

    beforeEach(() => {
      dates = [new Date(2016, 5), new Date(2017, 11)];
      months = new DateMonths(...dates);
    });

    it('should change all', () => {
      const results = months.changeMonth(1);

      expect(results).toBeSameDay([new Date(2016, 1), new Date(2017, 1)]);
    })

    it('should change first', () => {
      const results = months.changeMonth(1, 0);

      expect(results).toBeSameDay([new Date(2016, 1), dates[1]]);
    })

    it('should not change if not needed', () => {
      const results = months.changeMonth(5, 0);

      expect(results).toBe(months);
      expect(results).toEqual(dates);
    })
  })

  describe('changeYear', () => {
    let dates: Date[];
    let months: DateMonths;

    beforeEach(() => {
      dates = [new Date(2016, 5), new Date(2017, 11)];
      months = new DateMonths(...dates);
    });

    it('should change all', () => {
      const results = months.changeYear(2018);

      expect(results).toBeSameDay([new Date(2018, 5), new Date(2018, 11)]);
    })

    it('should change first', () => {
      const results = months.changeYear(2018, 0);

      expect(results).toBeSameDay([new Date(2018, 5), dates[1]]);
    })

    it('should not change if not needed', () => {
      const results = months.changeYear(2016, 0);

      expect(results).toBe(months);
      expect(results).toEqual(dates);
    })
  })

  describe('toMonth', () => {
    let dates: Date[];
    let months: DateMonths;

    beforeEach(() => {
      dates = [new Date(2016, 5), new Date(2017, 11)];
      months = new DateMonths(...dates);
    });

    it('should set all', () => {
      const results = months.toMonth(2018, 3);

      expect(results).toBeSameDay([new Date(2018, 3), new Date(2018, 3)]);
    })

    it('should set first', () => {
      const results = months.toMonth(2018, 3, 0);

      expect(results).toBeSameDay([new Date(2018, 3), dates[1]]);
    })

    it('should not set if not needed', () => {
      const results = months.toMonth(2016, 5, 0);

      expect(results).toBe(months);
      expect(results).toEqual(dates);
    })
  })

});
