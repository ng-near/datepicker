import { Pipe, PipeTransform } from '@angular/core';

import { getIsoWeek, MonthDate } from '../utils/utils';

export interface ISOWeekOfYear {
    year: number;
    week: number;
}

@Pipe({
    name: 'isoWeeks',
    pure: true,
})
export class ISOWeeks implements PipeTransform {

    transform(monthDate: MonthDate, showSixMonth = false) {
        const year = monthDate.getFullYear();
        const firstWeek = getIsoWeek(monthDate);

        let weekCount: number;
        if (showSixMonth) {
            weekCount = 6;
        } else {
            const endMonth = new Date(Date.UTC(year, monthDate.getMonth() + 1, 0));
            // get how many days before the start of the first week
            const daysToMonday = (monthDate.getDay() || 7) - 1;
            // get how many days until the end of the last week
            const daysToSunday = 7 - (endMonth.getDay() || 7) ;

            weekCount = (endMonth.getDate() + daysToMonday + daysToSunday) / 7;
        }

        const result = [{week: firstWeek, year}];
        let week: number;

        if (firstWeek > 51) {
            result[0].year--;
            week = 1;
        } else {
            week = firstWeek + 1;
        }

        for (let end = week + weekCount - 1; week < end; week++) {
            result.push({week, year});
        }

        return result;
    }
}

@Pipe({
    name: 'isoDays',
    pure: true,
})
export class ISODays implements PipeTransform {

    transform(isoWeek: ISOWeekOfYear) {
        const { year } = isoWeek;

        const firstDayOfWeek = new Date(year, 0).getDay();

        /* original formula : (4 - firstDay) + 7 % 7
            - +7 cause js doesn't handle negative numbers on modulo
        */
        const shiftToFirstThursday = (11 - firstDayOfWeek) % 7;
        const shiftToWeek = (isoWeek.week - 1) * 7;
        // 1 for Jan 1 + how many days to be on first Thursday of year + how many days to get on requested week number
        const shiftToThursdayOnWeek = 1 + shiftToFirstThursday + shiftToWeek;

        const result = [];
        // we shift to thursday so the week is from 3 days before (monday) to 3 days after (sunday)
        for (let i = -3; i < 4; i++) {
            result.push(new Date(year, 0, shiftToThursdayOnWeek + i));
        }

        return result;
    }
}
