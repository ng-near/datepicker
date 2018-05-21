import { Pipe, PipeTransform } from '@angular/core';

import { getIsoWeek, MonthDate } from '../index';

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

        const firstDay = new Date(year, 0).getDate() || 7;

        const shiftToFirstMonday = -(firstDay - 1);
        const shiftToWeek = (isoWeek.week - 1) * 7;
        const shiftToStartWeek = shiftToFirstMonday + shiftToWeek;

        const result = [];
        for (let i = 1; i < 8; i++) {
            result.push(new Date(year, 0, shiftToStartWeek + i));
        }

        return result;
    }
}
