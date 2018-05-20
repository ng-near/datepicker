import * as moment from 'moment';

import { getIsoWeek } from '../../../src/utils/utils';

describe('getIsoWeek', () => {
    it('should find same iso week number as momentjs', () => {
        for (let i = 1900; i < 4500; i++) {
            for (let j = 0; j < 12; j++) {
                const date = new Date(i, j);

                const week = getIsoWeek(date);
                const momentWeek = moment(date).isoWeek();

                expect(week).toBe(momentWeek);
            }
        }
    });
});