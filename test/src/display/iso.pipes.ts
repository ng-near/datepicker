import { ISODays, ISOWeeks } from '../../../src/display/iso.pipes';

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
  