import { convertDate, ensureDayDate, ensureMonthDate, isSameDay, isSameMonth } from '../../../src/index';
import { getIsoWeek } from '../../../src/utils/utils';

function expectMidnight(date: Date) {
    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
    expect(date.getSeconds()).toBe(0);
    expect(date.getMilliseconds()).toBe(0);
}

describe('ensureDayDate', () => {
    // don't run that test at midnight !! :)
    // this test is non-deterministic so if it ever fail, we need to repro the fail in another test
    it('should return current day with time set to 0', () => {
        const now = new Date();
        const dayDate = ensureDayDate();

        expect(dayDate.getFullYear()).toBe(now.getFullYear());
        expect(dayDate.getMonth()).toBe(now.getMonth());
        expect(dayDate.getDate()).toBe(now.getDate());

        expectMidnight(dayDate);
    });

    it('should return same date day with time set to 0', () => {
        const date = new Date(2010, 5, 25, 11, 25, 12);
        const dayDate = ensureDayDate(date);

        expect(dayDate.getFullYear()).toBe(date.getFullYear());
        expect(dayDate.getMonth()).toBe(date.getMonth());
        expect(dayDate.getDate()).toBe(date.getDate());

        expectMidnight(dayDate);
        expect(dayDate).not.toBe(date);
    });

    it('should return a copy of the date if date is already at midnight', () => {
        const date = new Date(2011, 0, 1);
        const dayDate = ensureDayDate(date);

        expect(dayDate.getFullYear()).toBe(date.getFullYear());
        expect(dayDate.getMonth()).toBe(date.getMonth());
        expect(dayDate.getDate()).toBe(date.getDate());

        expectMidnight(dayDate);
        expect(dayDate).not.toBe(date);
    });

    // TODO what are the edge cases ? DST ?
})

function expectFirstOfMonth(date: Date) {
    expect(date.getDate()).toBe(1);
    expectMidnight(date);
}

describe('newMonthDate', () => {
    // this test is non-deterministic so if it ever fail, we need to repro the fail in another test
    it('should return 1st of current month', () => {
        const now = new Date();
        const dayDate = ensureMonthDate();

        expect(dayDate.getFullYear()).toBe(now.getFullYear());
        expect(dayDate.getMonth()).toBe(now.getMonth());

        expectFirstOfMonth(dayDate);
    });

    it('should return 1st of date month', () => {
        const date = new Date(2017, 0, 10);
        const dayDate = ensureMonthDate(date);

        expect(dayDate.getFullYear()).toBe(date.getFullYear());
        expect(dayDate.getMonth()).toBe(date.getMonth());

        expectFirstOfMonth(dayDate);
        expect(dayDate).not.toBe(date);
    });

    it('should return a copy of same day', () => {
        const date = new Date(2019, 11, 1);
        const dayDate = ensureMonthDate(date);

        expect(dayDate.getFullYear()).toBe(date.getFullYear());
        expect(dayDate.getMonth()).toBe(date.getMonth());

        expectFirstOfMonth(dayDate);
    });

    it('should return a copy of same day with time set to 0', () => {
        const date = new Date(2020, 5, 1, 15, 24, 12);
        const dayDate = ensureMonthDate(date);

        expect(dayDate.getFullYear()).toBe(date.getFullYear());
        expect(dayDate.getMonth()).toBe(date.getMonth());

        expectFirstOfMonth(dayDate);
    });
})

describe('isSameDay', () => {
    it('should return true when both date have same reference', () => {
        const date = new Date(2017, 10, 1);
        const date1 = date;
        date1.setDate(10);

        expect(isSameDay(date, date1)).toBe(true);
    })

    it('should return true if date are on the same day', () => {
        expect(isSameDay(new Date(2017, 10, 1), new Date(2017, 10, 1))).toBe(true);
    })

    it('should return true if date are the same day even if time differ', () => {
        expect(isSameDay(new Date(2017, 10, 1, 10, 15), new Date(2017, 10, 1, 12, 10))).toBe(true);
    })

    it('should return true if both date are null or both are undefined', () => {
        expect(isSameDay(null, null)).toBe(true);
        expect(isSameDay(undefined, undefined)).toBe(true);
    })

    it('should return false when one date is null/undefined', () => {
        expect(isSameDay(new Date(2017, 10, 1), undefined)).toBe(false);
        expect(isSameDay(new Date(2017, 10, 1), null)).toBe(false);

        expect(isSameDay(undefined, new Date(2017, 10, 1))).toBe(false);
        expect(isSameDay(null, new Date(2017, 10, 1))).toBe(false);
    })

    it('should return false when one date is null and the other is undefined', () => {
        expect(isSameDay(null, undefined)).toBe(false);
        expect(isSameDay(undefined, null)).toBe(false);
    })

    it('should return false if date are not the same day', () => {
        expect(isSameDay(new Date(2017, 10, 1), new Date(2017, 10, 2))).toBe(false);
        expect(isSameDay(new Date(2017, 10, 1), new Date(2017, 11, 1))).toBe(false);
        expect(isSameDay(new Date(2017, 10, 1), new Date(2018, 10, 1))).toBe(false);
    })
})

describe('isSameMonth', () => {
    it('should return true when both date have same reference', () => {
        const date = new Date(2017, 10, 1);
        const date1 = date;
        date1.setDate(10);

        expect(isSameMonth(date, date1)).toBe(true);
    })

    it('should return true if date are on the same mont', () => {
        expect(isSameMonth(new Date(2017, 10, 1), new Date(2017, 10, 1))).toBe(true);
        expect(isSameMonth(new Date(2017, 10, 1), new Date(2017, 10, 10))).toBe(true);
        expect(isSameMonth(new Date(2017, 10, 1), new Date(2017, 10, 30))).toBe(true);
    })

    it('should return true if date are the same day even if time differ', () => {
        expect(isSameMonth(new Date(2017, 10, 1, 10, 15), new Date(2017, 10, 1, 11, 30))).toBe(true);
        expect(isSameMonth(new Date(2017, 10, 1, 10, 15), new Date(2017, 10, 10, 11, 30))).toBe(true);
        expect(isSameMonth(new Date(2017, 10, 1, 10, 15), new Date(2017, 10, 30, 11, 30))).toBe(true);
    })

    it('should return false when any date is null/undefined', () => {
        expect(isSameMonth(new Date(2017, 10, 1), undefined)).toBe(false);
        expect(isSameMonth(new Date(2017, 10, 1), null)).toBe(false);

        expect(isSameMonth(undefined, new Date(2017, 10, 1))).toBe(false);
        expect(isSameMonth(null, new Date(2017, 10, 1))).toBe(false);

        expect(isSameMonth(null, null)).toBe(false);
        expect(isSameMonth(null, undefined)).toBe(false);
        expect(isSameMonth(undefined, null)).toBe(false);
        expect(isSameMonth(undefined, undefined)).toBe(false);
    })

    it('should return false if date are not the same month', () => {
        expect(isSameMonth(new Date(2017, 10, 1), new Date(2017, 11, 1))).toBe(false);
        expect(isSameMonth(new Date(2017, 10, 1), new Date(2018, 10, 1))).toBe(false);
    })
})

describe('getIsoWeek', () => {

    it('should work when first day of year is Sunday', () => {
        expect(getIsoWeek(new Date(2017, 0, 1))).toBe(52);
        expect(getIsoWeek(new Date(2017, 2, 2))).toBe(9);
        expect(getIsoWeek(new Date(2017, 11, 31))).toBe(52);
    });

    it('should work when first day of year is Monday', () => {
        expect(getIsoWeek(new Date(2018, 0, 2))).toBe(1);
        expect(getIsoWeek(new Date(2018, 2, 19))).toBe(12);
        expect(getIsoWeek(new Date(2018, 7, 1))).toBe(31);
    });

    it('should work when first day of year is Tuesday', () => {
        expect(getIsoWeek(new Date(2019, 3, 15))).toBe(16);
        expect(getIsoWeek(new Date(2019, 8, 29))).toBe(39);
        expect(getIsoWeek(new Date(2019, 10, 12))).toBe(46);
    });

    it('should work when first day of year is Wednesday', () => {
        expect(getIsoWeek(new Date(2014, 0, 1))).toBe(1);
        expect(getIsoWeek(new Date(2014, 5, 10))).toBe(24);
        expect(getIsoWeek(new Date(2014, 10, 2))).toBe(44);
    });

    it('should work when first day of year is Thursday', () => {
        expect(getIsoWeek(new Date(2015, 1, 9))).toBe(7);
        expect(getIsoWeek(new Date(2015, 3, 10))).toBe(15);
        expect(getIsoWeek(new Date(2015, 11, 31))).toBe(53);
    });

    it('should work when first day of year is Friday', () => {
        expect(getIsoWeek(new Date(2021, 1, 1))).toBe(5);
        expect(getIsoWeek(new Date(2021, 4, 22))).toBe(20);
        expect(getIsoWeek(new Date(2021, 5, 30))).toBe(26);
    });

    it('should work when first day of year is Saturday', () => {
        expect(getIsoWeek(new Date(2022, 0, 29))).toBe(4);
        expect(getIsoWeek(new Date(2022, 2, 30))).toBe(13);
        expect(getIsoWeek(new Date(2022, 9, 1))).toBe(39);
    });

    it('should work on leap year', () => {
        // each test has it's first day of year being a different week day
        // sunday
        expect(getIsoWeek(new Date(2040, 0, 1))).toBe(52);
        // monday
        expect(getIsoWeek(new Date(2024, 4, 1))).toBe(18);
        // tuesday
        expect(getIsoWeek(new Date(2036, 6, 30))).toBe(31);
        // wednesday
        expect(getIsoWeek(new Date(2020, 1, 27))).toBe(9);
        // thursday
        expect(getIsoWeek(new Date(2032, 2, 1))).toBe(10);
        // friday
        expect(getIsoWeek(new Date(2016, 2, 1))).toBe(9);
        // saturday
        expect(getIsoWeek(new Date(2028, 3, 20))).toBe(16);
    });
});

describe('convertDate', () => {

    // should we return a copy ?
    it('should return the date passed in', () => {
        const date = new Date(2017, 10, 1);

        expect(convertDate(date)).toBe(date);
    })

    it('should convert from valid number', () => {
        expect(convertDate(500)).toEqual(new Date(500));
    })

    it('should convert from valid string', () => {
        expect(convertDate('December 17, 1995 03:24:00')).toEqual(new Date('December 17, 1995 03:24:00'));
    })

    it('should convert from valid object', () => {
        expect(convertDate({
            year: 2010,
            month: 2,
            date: 5,
        })).toEqual(new Date(2010, 2, 5));

        expect(convertDate({
            year: 2010,
            month: 2,
            day: 5,
        })).toEqual(new Date(2010, 2, 5));
    })

    it('should prefer day over date', () =>{
        expect(convertDate({
            year: 2010,
            month: 2,
            day: 5,
            date: 10,
        })).toEqual(new Date(2010, 2, 5));
    })

    it('should return invalid date for invalid input (NaN, bad string or invalid type from signature)', () =>{
        expect(convertDate(NaN).getTime()).toBeNaN();
        expect(convertDate('abc').getTime()).toBeNaN();
        expect(convertDate({}).getTime()).toBeNaN();
        expect(convertDate(null).getTime()).toBeNaN();
        expect(convertDate(undefined).getTime()).toBeNaN();
        expect(convertDate(new Date(NaN)).getTime()).toBeNaN();
    })
})
