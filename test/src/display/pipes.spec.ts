import { registerLocaleData, TranslationWidth } from '@angular/common';

import * as moment from 'moment';

import { DayNames, Days, ISODays, ISOWeeks, MonthNames, Years } from '../../../src/display/pipes';
import { localeArAE } from '../validator/locale.ar-AE';
import { localeFr } from './locale.fr';

// TODO karma error when importing locales from angular
// import localeFr from '@angular/common/locales/fr';

beforeAll(() => {
  registerLocaleData(localeFr);
  registerLocaleData(localeArAE);
})

describe('DayNames', () => {
  let pipe: DayNames;

  beforeEach(() => {
    pipe = new DayNames('en-US');
  })

  describe('locale', () => {
    it('should use global locale by default', () => {
      expect(pipe.transform(TranslationWidth.Wide)).toEqual([
        {value: 0, name: 'Sunday'},
        {value: 1, name: 'Monday'},
        {value: 2, name: 'Tuesday'},
        {value: 3, name: 'Wednesday'},
        {value: 4, name: 'Thursday'},
        {value: 5, name: 'Friday'},
        {value: 6, name: 'Saturday'},
      ]);
    })

    it('should use locale passed in', () => {
      expect(pipe.transform(TranslationWidth.Wide, 'fr')).toEqual([
        {value: 1, name: 'lundi'},
        {value: 2, name: 'mardi'},
        {value: 3, name: 'mercredi'},
        {value: 4, name: 'jeudi'},
        {value: 5, name: 'vendredi'},
        {value: 6, name: 'samedi'},
        {value: 0, name: 'dimanche'},
      ]);
    })

    it('first day should corresponding to locale\'s first day of week', () => {
      // only need to test values but whatever
      expect(pipe.transform(TranslationWidth.Wide, 'fr')).toEqual([
        {value: 1, name: 'lundi'},
        {value: 2, name: 'mardi'},
        {value: 3, name: 'mercredi'},
        {value: 4, name: 'jeudi'},
        {value: 5, name: 'vendredi'},
        {value: 6, name: 'samedi'},
        {value: 0, name: 'dimanche'},
      ]);
    })

    it('should work with TranslationWidth as string', () => {
      expect(pipe.transform('narrow')).toEqual([
        {value: 0, name: 'S'},
        {value: 1, name: 'M'},
        {value: 2, name: 'T'},
        {value: 3, name: 'W'},
        {value: 4, name: 'T'},
        {value: 5, name: 'F'},
        {value: 6, name: 'S'},
      ]);
    })
  })
});

describe('MonthNames', () => {
  let pipe: MonthNames;

  beforeEach(() => {
    pipe = new MonthNames('en-US');
  })

  describe('locale', () => {
    it('should use global locale by default', () => {
      expect(pipe.transform(TranslationWidth.Wide)).toEqual([
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ]);
    })

    it('should use locale passed in', () => {
      expect(pipe.transform(TranslationWidth.Wide, 'fr')).toEqual([
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ]);
    })

    it('should work with TranslationWidth as string', () => {
      expect(pipe.transform('abbreviated')).toEqual([
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]);
    })
  })
});

describe('Years', () => {
  let pipe: Years;

  beforeAll(() => {
    const DateCtor = Date;

    spyOn(window as any, 'Date').and.callFake(function() {
      if (arguments.length > 0) {
        throw new Error('We are mocking Date and don\'t expect it to be called with any arguments');
      }

      return new DateCtor(2000, 0);
    });
  })

  beforeEach(() => {
    pipe = new Years();
  })

  it('should go from start to end', () => {
    expect(pipe.transform({start: 2000, end: 2002})).toEqual([
      2000, 2001, 2002
    ]);
  })

  it('should go from start to end (backward in time)', () => {
    expect(pipe.transform({start: 2002, end: 2000})).toEqual([
      2002, 2001, 2000
    ]);
  })

  it('should work with positive rstart and end', () => {
    expect(pipe.transform({rstart: 2, end: 2004})).toEqual([
      2002, 2003, 2004
    ]);
  })

  it('should work with negative rstart and end', () => {
    expect(pipe.transform({rstart: -2, end: 2004})).toEqual([
      1998, 1999, 2000, 2001, 2002, 2003, 2004
    ]);
  })

  it('should work with start and positive rend', () => {
    expect(pipe.transform({start: 2004, rend: 2})).toEqual([
      2004, 2003, 2002
    ]);
  })

  it('should work with start and negative rend', () => {
    expect(pipe.transform({start: 1996, rend: -2})).toEqual([
      1996, 1997, 1998
    ]);
  })

  it('should work with rstart and rend', () => {
    expect(pipe.transform({rstart: -2, rend: 2})).toEqual([
      1998, 1999, 2000, 2001, 2002
    ]);
  })

  it('should work with rstart and rend (backward in time)', () => {
    expect(pipe.transform({rstart: 2, rend: -2})).toEqual([
      2002, 2001, 2000, 1999, 1998
    ]);
  })
});

function rangeDate(startDate, nbWeeks) {
  const days = [];

  for (let i = 0, l = nbWeeks * 7; i < l; i++) {
    days.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));
  }

  return days;
}

describe('Days', () => {

  it('should work when 1st and last day of month is in the middle of the week', () => {
    expect(new Days('en-US').transform(new Date(2014, 6)))
      .toEqual(rangeDate(new Date(2014, 5, 29), 5));
  });

  it('should work when 1st of month is Sunday', () => {
    expect(new Days('en-US').transform(new Date(2014, 5)))
      .toEqual(rangeDate(new Date(2014, 5, 1), 5));
  });

  it('should work when 1st of month is Saturday', () => {
    expect(new Days('en-US').transform(new Date(2014, 2)))
      .toEqual(rangeDate(new Date(2014, 1, 23), 6));
  });

  it('should work on December with some days on next January', () => {
    expect(new Days('en-US').transform(new Date(2014, 11)))
      .toEqual(rangeDate(new Date(2014, 10, 30), 5));
  });

  it('should work on January with some days on previous December', () => {
    expect(new Days('en-US').transform(new Date(2014, 0)))
      .toEqual(rangeDate(new Date(2013, 11, 29), 5));
  });

  it('should work when last day of month is Saturday', () => {
    expect(new Days('en-US').transform(new Date(2014, 4)))
      .toEqual(rangeDate(new Date(2014, 3, 27), 5));
  });

  it('should work when month has 6 weeks', () => {
    expect(new Days('en-US').transform(new Date(2014, 7)))
      .toEqual(rangeDate(new Date(2014, 6, 27), 6));
  });

  it('should work when month has 4 weeks', () => {
    expect(new Days('en-US').transform(new Date(2015, 1)))
      .toEqual(rangeDate(new Date(2015, 1, 1), 4));
  });

  it('should work whith leap year', () => {
    expect(new Days('en-US').transform(new Date(2016, 1)))
      .toEqual(rangeDate(new Date(2016, 0, 31), 5));
    expect(new Days('en-US').transform(new Date(2016, 6)))
      .toEqual(rangeDate(new Date(2016, 5, 26), 6));
  });

  it('should work when DST occurs during the month (need CET/CEST timezone)', () => {
    expect(new Days('en-US').transform(new Date(2015, 2)))
      .toEqual(rangeDate(new Date(2015, 2, 1), 5));
    expect(new Days('en-US').transform(new Date(2015, 9)))
      .toEqual(rangeDate(new Date(2015, 8, 27), 5));
  });

  describe('sixWeeks', () => {
    it('should return 6 weeks when month only has 4', () => {
      expect(new Days('en-US').transform(new Date(2015, 1), true).length)
        .toBe(42);
    });

    it('should return 6 weeks when month only has 5', () => {
      expect(new Days('en-US').transform(new Date(2015, 2), true).length)
        .toBe(42);
    });

    it('should return 6 weeks when month has 6', () => {
      expect(new Days('en-US').transform(new Date(2015, 7), true).length)
        .toBe(42);
    });
  });

  describe('first day of week', () => {
    it('should work with different locale where monday is first day of week', () => {
      expect(new Days('fr-FR').transform(new Date(2014, 6)))
        .toEqual(rangeDate(new Date(2014, 5, 30), 5))
      ;
    });

    it('should work with different locale where saturday is first day of week', () => {
      expect(new Days('ar-AE').transform(new Date(2014, 6)))
        .toEqual(rangeDate(new Date(2014, 5, 28), 5))
      ;
    });

    it('should use locale passed in arg over global LOCALE_ID', () => {
      expect(new Days('en-US').transform(new Date(2014, 6), false, 'fr-FR'))
        .toEqual(rangeDate(new Date(2014, 5, 30), 5))
      ;
    });

    it('should override locale first day of week with arg', () => {
      expect(new Days('en-US').transform(new Date(2014, 6), false, 1))
        .toEqual(rangeDate(new Date(2014, 5, 30), 5))
      ;
    });
  });
});

describe('ISO weeks', () => {
  let pipe: ISOWeeks;

  beforeEach(() => {
    pipe = new ISOWeeks();
  })

  it('should return same weeks as moment from 1900 to 4500', () => {
    for (let i = 1900; i < 4500; i++) {
      for (let j = 0; j < 12; j++) {
          const date = new Date(i, j);

          const weeks = pipe.transform(date);
          let month = moment(date);

          const momentWeeks = [];
          while (month.month() === j) {
            momentWeeks.push({week: month.isoWeek(), year: month.isoWeekYear()});
            month.add(7, 'd');
          }

          const result = expect(weeks).toEqual(momentWeeks);
          if (!result) return;
      }
    }
  });

  it('should always return 6 weeks', () => {
    for (let i = 1900; i < 4500; i++) {
      for (let j = 0; j < 12; j++) {
          const date = new Date(i, j);

          const weeks = pipe.transform(date, true);
          let month = moment(date);

          const momentWeeks = [];
          for (let i = 0; i < 6; i++) {
            momentWeeks.push({week: month.isoWeek(), year: month.isoWeekYear()});
            month.add(7, 'd');
          }

          const result =
            expect(weeks.length).toBe(6) &&
            expect(weeks).toEqual(momentWeeks)
          ;

          if (!result) return;
      }
    }
  });
});

describe('ISODays', () => {
  let pipe: ISODays;

  beforeEach(() => {
    pipe = new ISODays();
  })

  it('should return same days of week as moment from 1900 to 4500', () => {
    // feels too complicated for a test :/
    for (let year = 1900; year < 4500; year++) {
      const weeksInYear = moment({year}).isoWeeksInYear();
      for (let week = 1; week <= weeksInYear; week++) {
        const days = pipe.transform({year, week});

        const momentDays = [];
        let momentDay = moment({year}).isoWeek(week).day(1).subtract(1, 'd');
        for (let i = 0; i < 7; i++) {
          momentDay.add(1, 'd');
          momentDays.push( momentDay.toDate() );
        }

        const result = expect(days).toEqual(momentDays);
        if (!result) return;
      }
    }
  });
});
