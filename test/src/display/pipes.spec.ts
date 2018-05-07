import { registerLocaleData, TranslationWidth } from '@angular/common';

import { DayNames, ISOWeeks, MonthNames, Years } from '../../../src/display/pipes';
import { localeFr } from './locale.fr';

// TODO karma error when importing locales from angular
// import localeFr from '@angular/common/locales/fr';

beforeAll(() => {
  registerLocaleData(localeFr);
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

describe('ISO weeks', () => {
  let pipe: ISOWeeks;

  beforeEach(() => {
    pipe = new ISOWeeks();
  })

  it('should work on year starting on Monday', () => {
    expect(pipe.transform(new Date(2018, 4))).toEqual([
      18, 19, 20, 21, 22
    ]);
  })

  it('should work on year starting on Tuesday', () => {
    expect(pipe.transform(new Date(2019, 4))).toEqual([
      18, 19, 20, 21, 22
    ]);
  })

  it('should work on year starting on Wednesday', () => {
    expect(pipe.transform(new Date(2020, 5))).toEqual([
      23, 24, 25, 26, 27
    ]);
  })

  it('should work on year starting on Thursday', () => {
    expect(pipe.transform(new Date(2026, 7))).toEqual([
      31, 32, 33, 34, 35, 36
    ]);
  })

  it('should work on year starting on Friday', () => {
    expect(pipe.transform(new Date(2027, 4))).toEqual([
      17, 18, 19, 20, 21, 22
    ]);
  })

  it('should work on year starting on Saturday', () => {
    expect(pipe.transform(new Date(2028, 4))).toEqual([
      18, 19, 20, 21, 22
    ]);
  })

  it('should work on year starting on Sunday', () => {
    expect(pipe.transform(new Date(2023, 5))).toEqual([
      22, 23, 24, 25, 26
    ]);
  })

  it('should work on leap year', () => {
    expect(pipe.transform(new Date(2032, 2))).toEqual([
      10, 11, 12, 13, 14
    ]);
  })

  fit('first week of year should be 52', () => {
    expect(pipe.transform(new Date(2023, 0))).toEqual([
      52, 1, 2, 3, 4
    ]);
  })

  it('first week of year should be 53', () => {
    expect(pipe.transform(new Date(2021, 0))).toEqual([
      53, 1, 2, 3, 4
    ]);
  })

  // can we test different timezone ?
});
