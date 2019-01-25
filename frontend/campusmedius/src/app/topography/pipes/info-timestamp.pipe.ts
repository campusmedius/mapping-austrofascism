import { Pipe, PipeTransform } from '@angular/core';

import { Event } from '../models/event';
import * as moment from 'moment';

@Pipe({
    name: 'infoTimestamp'
})
export class InfoTimestampPipe implements PipeTransform {

    transform(event: Event, lang: string): string {
        if (!event) {
            return null;
        }

        let sameDay = false;
        if (event.start.diff(event.end, 'days') === 0) {
            sameDay = true;
        }

        let str = '';
        if (lang === 'en') {
            event.start.locale('en');
            event.end.locale('en');

            if (event.id === '9') {
                return event.start.utcOffset(60).format('MMMM D, YYYY \xa0\xa0\xa0 h:mm a');
            }

            str = event.start.utcOffset(60).format('MMMM D, YYYY \xa0\xa0\xa0 h:mm a') + ' – ';
            if (sameDay) {
                str += event.end.utcOffset(60).format('h:mm a');
            } else {
                str += event.end.utcOffset(60).format('MMMM D, YYYY \xa0\xa0\xa0 h:mm a');
            }
        }
        if (lang === 'de') {
            event.start.locale('de-at');
            event.end.locale('de-at');

            if (event.id === '9') {
                return event.start.utcOffset(60).format('D. MMMM YYYY \xa0\xa0\xa0 k:mm') + ' Uhr';
            }

            if (sameDay) {
                str = event.start.utcOffset(60).format('D. MMMM YYYY \xa0\xa0\xa0 k:mm') + ' – ';
                str += event.end.utcOffset(60).format('k:mm') + ' Uhr';
            } else {
                str = event.start.utcOffset(60).format('D. MMMM YYYY \xa0\xa0\xa0 k:mm') + ' Uhr – ';
                str += event.end.utcOffset(60).format('D. MMMM YYYY \xa0\xa0\xa0 h:mm') + ' Uhr';
            }
        }
        return str;
    }

}
