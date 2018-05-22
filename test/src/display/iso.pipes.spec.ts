import { ISODays, ISOWeeks } from '../../../src/display/iso.pipes';

describe('ISO weeks', () => {
  let pipe: ISOWeeks;

  beforeEach(() => {
      pipe = new ISOWeeks();
  })

  it('should work on 4 weeks months', () => {
      expect(pipe.transform(new Date(2010, 1))).toEqual([
        { year: 2010, week: 5 },
        { year: 2010, week: 6 },
        { year: 2010, week: 7 },
        { year: 2010, week: 8 },
      ]);
  })

  it('should work on 5 weeks months', () => {
    expect(pipe.transform(new Date(2010, 2))).toEqual([
      { year: 2010, week: 9 },
      { year: 2010, week: 10 },
      { year: 2010, week: 11 },
      { year: 2010, week: 12 },
      { year: 2010, week: 13 },
    ]);
  })

  it('should work on 6 weeks months', () => {
    expect(pipe.transform(new Date(2010, 7))).toEqual([
      { year: 2010, week: 30 },
      { year: 2010, week: 31 },
      { year: 2010, week: 32 },
      { year: 2010, week: 33 },
      { year: 2010, week: 34 },
      { year: 2010, week: 35 },
    ]);
  })

  it('should work when first week is part of last year', () => {
    expect(pipe.transform(new Date(2010, 0))).toEqual([
      { year: 2009, week: 53 },
      { year: 2010, week: 1 },
      { year: 2010, week: 2 },
      { year: 2010, week: 3 },
      { year: 2010, week: 4 },
    ]);
  })

  it('should always return 6 weeks', () => {
    expect(pipe.transform(new Date(2010, 0), true).length).toBe(6);
    expect(pipe.transform(new Date(2010, 1), true).length).toBe(6);
    expect(pipe.transform(new Date(2010, 2), true).length).toBe(6);
    expect(pipe.transform(new Date(2010, 7), true).length).toBe(6);
  });
});

function weekRange(startDate: Date) {
  const res = [];
  for (let i = 0; i < 7; i++) {
    res.push( new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i) );
  }

  return res;
}

describe('ISODays', () => {
  let pipe: ISODays;

  beforeEach(() => {
    pipe = new ISODays();
  })

  // for each test, test first last and a random week.
  it('should work when year start on a Monday', () => {
    expect(pipe.transform({year: 2018, week: 1}))
      .toEqual(weekRange(new Date(2018, 0, 1)));

    expect(pipe.transform({year: 2018, week: 21}))
      .toEqual(weekRange(new Date(2018, 4, 21)));

    expect(pipe.transform({year: 2018, week: 52}))
      .toEqual(weekRange(new Date(2018, 11, 24)));
  });

  it('should work when year start on a Tuesday', () => {
    expect(pipe.transform({year: 2013, week: 1}))
      .toEqual(weekRange(new Date(2012, 11, 31)));

    expect(pipe.transform({year: 2013, week: 44}))
      .toEqual(weekRange(new Date(2013, 9, 28)));

    expect(pipe.transform({year: 2013, week: 52}))
      .toEqual(weekRange(new Date(2013, 11, 23)));
  });

  it('should work when year start on a Wednesday', () => {
    expect(pipe.transform({year: 2014, week: 1}))
      .toEqual(weekRange(new Date(2013, 11, 30)));

    expect(pipe.transform({year: 2014, week: 9}))
      .toEqual(weekRange(new Date(2014, 1, 24)));

    expect(pipe.transform({year: 2014, week: 52}))
      .toEqual(weekRange(new Date(2014, 11, 22)));
  });

  it('should work when year start on a Thursday', () => {
    expect(pipe.transform({year: 2015, week: 1}))
      .toEqual(weekRange(new Date(2014, 11, 29)));

    expect(pipe.transform({year: 2015, week: 33}))
      .toEqual(weekRange(new Date(2015, 7, 10)));

    expect(pipe.transform({year: 2015, week: 53}))
      .toEqual(weekRange(new Date(2015, 11, 28)));
  });

  it('should work when year start on a Friday', () => {
    expect(pipe.transform({year: 2010, week: 1}))
      .toEqual(weekRange(new Date(2010, 0, 4)));

    expect(pipe.transform({year: 2010, week: 13}))
      .toEqual(weekRange(new Date(2010, 2, 29)));

    expect(pipe.transform({year: 2010, week: 52}))
      .toEqual(weekRange(new Date(2010, 11, 27)));
  });

  it('should work when year start on a Saturday', () => {
    expect(pipe.transform({year: 2011, week: 1}))
      .toEqual(weekRange(new Date(2011, 0, 3)));

    expect(pipe.transform({year: 2011, week: 35}))
      .toEqual(weekRange(new Date(2011, 7, 29)));

    expect(pipe.transform({year: 2011, week: 52}))
      .toEqual(weekRange(new Date(2011, 11, 26)));
  });

  it('should work when year start on a Sunday', () => {
    expect(pipe.transform({year: 2012, week: 1}))
      .toEqual(weekRange(new Date(2012, 0, 2)));

    expect(pipe.transform({year: 2012, week: 21}))
      .toEqual(weekRange(new Date(2012, 4, 21)));

    expect(pipe.transform({year: 2012, week: 52}))
      .toEqual(weekRange(new Date(2012, 11, 24)));
  });
});
