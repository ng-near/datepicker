/* TODO use those test to test ForMonth directive
import { DaysPipe } from './days.pipe';

describe('DaysPipe', () => {

  let daysPipe: DaysPipe;

  beforeEach( () => {
    daysPipe = new DaysPipe();
  });

  it('should return December 2014 (overlap days: 4 after)', () => {
    expect(daysPipe.transform(new Date(2014, 11, 1)))
      .toEqual([
        new Date(2014, 11, 1), new Date(2014, 11, 2), new Date(2014, 11, 3), new Date(2014, 11, 4), new Date(2014, 11, 5), new Date(2014, 11, 6), new Date(2014, 11, 7),
        new Date(2014, 11, 8), new Date(2014, 11, 9), new Date(2014, 11, 10), new Date(2014, 11, 11), new Date(2014, 11, 12), new Date(2014, 11, 13), new Date(2014, 11, 14),
        new Date(2014, 11, 15), new Date(2014, 11, 16), new Date(2014, 11, 17), new Date(2014, 11, 18), new Date(2014, 11, 19), new Date(2014, 11, 20), new Date(2014, 11, 21),
        new Date(2014, 11, 22), new Date(2014, 11, 23), new Date(2014, 11, 24), new Date(2014, 11, 25), new Date(2014, 11, 26), new Date(2014, 11, 27), new Date(2014, 11, 28),
        new Date(2014, 11, 29), new Date(2014, 11, 30), new Date(2014, 11, 31), new Date(2015, 0, 1), new Date(2015, 0, 2), new Date(2015, 0, 3), new Date(2015, 0, 4)
      ]);
  });

  it('should return January 2017 (overlap days: 6 before, 5 after)', () => {
    expect(daysPipe.transform(new Date(2017, 0, 1)))
      .toEqual([
        new Date(2016, 11, 26), new Date(2016, 11, 27), new Date(2016, 11, 28), new Date(2016, 11, 29), new Date(2016, 11, 30), new Date(2016, 11, 31), new Date(2017, 0, 1),
        new Date(2017, 0, 2), new Date(2017, 0, 3), new Date(2017, 0, 4), new Date(2017, 0, 5), new Date(2017, 0, 6), new Date(2017, 0, 7), new Date(2017, 0, 8),
        new Date(2017, 0, 9), new Date(2017, 0, 10), new Date(2017, 0, 11), new Date(2017, 0, 12), new Date(2017, 0, 13), new Date(2017, 0, 14), new Date(2017, 0, 15),
        new Date(2017, 0, 16), new Date(2017, 0, 17), new Date(2017, 0, 18), new Date(2017, 0, 19), new Date(2017, 0, 20), new Date(2017, 0, 21), new Date(2017, 0, 22),
        new Date(2017, 0, 23), new Date(2017, 0, 24), new Date(2017, 0, 25), new Date(2017, 0, 26), new Date(2017, 0, 27), new Date(2017, 0, 28), new Date(2017, 0, 29),
        new Date(2017, 0, 30), new Date(2017, 0, 31), new Date(2017, 1, 1), new Date(2017, 1, 2), new Date(2017, 1, 3), new Date(2017, 1, 4), new Date(2017, 1, 5)
      ]);
  });

  describe('6 weeks', () => {

    it('should return December 2014 (overlap days: 11 after)', () => {
      expect(daysPipe.transform(new Date(2014, 11, 1), true))
        .toEqual([
          new Date(2014, 11, 1), new Date(2014, 11, 2), new Date(2014, 11, 3), new Date(2014, 11, 4), new Date(2014, 11, 5), new Date(2014, 11, 6), new Date(2014, 11, 7),
          new Date(2014, 11, 8), new Date(2014, 11, 9), new Date(2014, 11, 10), new Date(2014, 11, 11), new Date(2014, 11, 12), new Date(2014, 11, 13), new Date(2014, 11, 14),
          new Date(2014, 11, 15), new Date(2014, 11, 16), new Date(2014, 11, 17), new Date(2014, 11, 18), new Date(2014, 11, 19), new Date(2014, 11, 20), new Date(2014, 11, 21),
          new Date(2014, 11, 22), new Date(2014, 11, 23), new Date(2014, 11, 24), new Date(2014, 11, 25), new Date(2014, 11, 26), new Date(2014, 11, 27), new Date(2014, 11, 28),
          new Date(2014, 11, 29), new Date(2014, 11, 30), new Date(2014, 11, 31), new Date(2015, 0, 1), new Date(2015, 0, 2), new Date(2015, 0, 3), new Date(2015, 0, 4),
          new Date(2015, 0, 5), new Date(2015, 0, 6), new Date(2015, 0, 7), new Date(2015, 0, 8), new Date(2015, 0, 9), new Date(2015, 0, 10), new Date(2015, 0, 11)
        ]);
    });

    it('should return January 2017 (overlap days: 6 before, 5 after)', () => {
      expect(daysPipe.transform(new Date(2017, 0, 1), true))
        .toEqual([
          new Date(2016, 11, 26), new Date(2016, 11, 27), new Date(2016, 11, 28), new Date(2016, 11, 29), new Date(2016, 11, 30), new Date(2016, 11, 31), new Date(2017, 0, 1),
          new Date(2017, 0, 2), new Date(2017, 0, 3), new Date(2017, 0, 4), new Date(2017, 0, 5), new Date(2017, 0, 6), new Date(2017, 0, 7), new Date(2017, 0, 8),
          new Date(2017, 0, 9), new Date(2017, 0, 10), new Date(2017, 0, 11), new Date(2017, 0, 12), new Date(2017, 0, 13), new Date(2017, 0, 14), new Date(2017, 0, 15),
          new Date(2017, 0, 16), new Date(2017, 0, 17), new Date(2017, 0, 18), new Date(2017, 0, 19), new Date(2017, 0, 20), new Date(2017, 0, 21), new Date(2017, 0, 22),
          new Date(2017, 0, 23), new Date(2017, 0, 24), new Date(2017, 0, 25), new Date(2017, 0, 26), new Date(2017, 0, 27), new Date(2017, 0, 28), new Date(2017, 0, 29),
          new Date(2017, 0, 30), new Date(2017, 0, 31), new Date(2017, 1, 1), new Date(2017, 1, 2), new Date(2017, 1, 3), new Date(2017, 1, 4), new Date(2017, 1, 5)
        ]);
    });
  });
});
*/
