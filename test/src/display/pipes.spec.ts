import { registerLocaleData, TranslationWidth } from '@angular/common';

import * as moment from 'moment';

import { DayNames, getFirstWeek, ISOWeeks, MonthNames, Years } from '../../../src/display/pipes';
import { localeFr } from './locale.fr';

// TODO karma error when importing locales from angular
// import localeFr from '@angular/common/locales/fr';

beforeAll(() => {
  registerLocaleData(localeFr);
})

xdescribe('special', () => {
  it('should find march week', () => {
    for (let i = 1900; i < 2500; i++) {
      let date = new Date(i, 3);
      let week = getFirstWeek(date);
      let momentWeek = moment(date).isoWeek();
      expect(week).toBe(momentWeek);

      if (week !== momentWeek) {
        console.log(i);
        break;
      }
    }
  });
});

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


describe('ISO weeks', () => {
  let pipe: ISOWeeks;

  beforeEach(() => {
    pipe = new ISOWeeks();
  })

  /* day must be a monday */
  function utcWeeks(year: number, month: number, day: number) {
    let last = new Date(Date.UTC(year, month, day - 1));

    return () => {
      const result = [];
      for (let i = 0; i < 7; i++) {
        result.push(
          last = new Date(Date.UTC(last.getFullYear(), last.getMonth(), last.getDate() + 1))
        );
      }

      return result;
    }
  }

  it('should work on year starting on Monday', () => {
    const nextWeek = utcWeeks(2018, 3, 30);

    expect(pipe.transform(new Date(2018, 4))).toEqual([
      { week: 18, days: nextWeek() },
      { week: 19, days: nextWeek() },
      { week: 20, days: nextWeek() },
      { week: 21, days: nextWeek() },
      { week: 22, days: nextWeek() },
    ]);
  })

  it('should work on year starting on Tuesday', () => {
    const nextWeek = utcWeeks(2019, 3, 29);

    expect(pipe.transform(new Date(2019, 4))).toEqual([
      { week: 18, days: nextWeek() },
      { week: 19, days: nextWeek() },
      { week: 20, days: nextWeek() },
      { week: 21, days: nextWeek() },
      { week: 22, days: nextWeek() },
    ]);
  })

  it('should work on year starting on Wednesday', () => {
    const nextWeek = utcWeeks(2020, 5, 1);

    expect(pipe.transform(new Date(2020, 5))).toEqual([
      { week: 23, days: nextWeek() },
      { week: 24, days: nextWeek() },
      { week: 25, days: nextWeek() },
      { week: 26, days: nextWeek() },
      { week: 27, days: nextWeek() },
    ]);
  })

  it('should work on year starting on Thursday', () => {
    const nextWeek = utcWeeks(2026, 6, 27);

    expect(pipe.transform(new Date(2026, 7))).toEqual([
      { week: 31, days: nextWeek() },
      { week: 32, days: nextWeek() },
      { week: 33, days: nextWeek() },
      { week: 34, days: nextWeek() },
      { week: 35, days: nextWeek() },
      { week: 36, days: nextWeek() },
    ]);
  })

  it('should work on year starting on Friday', () => {
    const nextWeek = utcWeeks(2027, 3, 26);

    expect(pipe.transform(new Date(2027, 4))).toEqual([
      { week: 17, days: nextWeek() },
      { week: 18, days: nextWeek() },
      { week: 19, days: nextWeek() },
      { week: 20, days: nextWeek() },
      { week: 21, days: nextWeek() },
      { week: 22, days: nextWeek() },
    ]);
  })

  it('should work on year starting on Saturday', () => {
    const nextWeek = utcWeeks(2028, 4, 1);

    expect(pipe.transform(new Date(2028, 4))).toEqual([
      { week: 18, days: nextWeek() },
      { week: 19, days: nextWeek() },
      { week: 20, days: nextWeek() },
      { week: 21, days: nextWeek() },
      { week: 22, days: nextWeek() },
    ]);
  })

  it('should work on year starting on Sunday', () => {
    const nextWeek = utcWeeks(2023, 4, 29);

    expect(pipe.transform(new Date(2023, 5))).toEqual([
      { week: 22, days: nextWeek() },
      { week: 23, days: nextWeek() },
      { week: 24, days: nextWeek() },
      { week: 25, days: nextWeek() },
      { week: 26, days: nextWeek() },
    ]);
  })

  it('should work on leap year', () => {
    const nextWeek = utcWeeks(2032, 2, 1);

    expect(pipe.transform(new Date(2032, 2))).toEqual([
      { week: 10, days: nextWeek() },
      { week: 11, days: nextWeek() },
      { week: 12, days: nextWeek() },
      { week: 13, days: nextWeek() },
      { week: 14, days: nextWeek() },
    ]);
  })

  it('first week of year should be 1', () => {
    const nextWeek = utcWeeks(2019, 11, 30);

    expect(pipe.transform(new Date(2020, 0))).toEqual([
      { week: 1, days: nextWeek() },
      { week: 2, days: nextWeek() },
      { week: 3, days: nextWeek() },
      { week: 4, days: nextWeek() },
      { week: 5, days: nextWeek() },
    ]);
  })

  it('first week of year should be 52', () => {
    const nextWeek = utcWeeks(2022, 11, 26);

    expect(pipe.transform(new Date(2023, 0))).toEqual([
      { week: 52, days: nextWeek() },
      { week: 1, days: nextWeek() },
      { week: 2, days: nextWeek() },
      { week: 3, days: nextWeek() },
      { week: 4, days: nextWeek() },
      { week: 5, days: nextWeek() },
    ]);
  })

  it('first week of year should be 53', () => {
    const nextWeek = utcWeeks(2020, 11, 28);

    expect(pipe.transform(new Date(2021, 0))).toEqual([
      { week: 53, days: nextWeek() },
      { week: 1, days: nextWeek() },
      { week: 2, days: nextWeek() },
      { week: 3, days: nextWeek() },
      { week: 4, days: nextWeek() },
    ]);
  })

  // can we test different timezone ?
});
