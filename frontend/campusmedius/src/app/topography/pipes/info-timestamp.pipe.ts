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

            str = event.start.format('MMMM D, YYYY h:mm a') + ' - ';
            if (sameDay) {
                str += event.end.format('h:mm a');
            } else {
                str += event.end.format('MMMM D, YYYY h:mm a');
            }
        }
        if (lang === 'de') {
            event.start.locale('de-at');
            event.end.locale('de-at');

            str = event.start.format('MMMM D, YYYY h:mm a') + ' - ';
            str = event.start.format('D. MMMM YYYY k:mm') + ' - ';
            if (sameDay) {
                str += event.end.format('k:mm');
            } else {
                str += event.end.format('D. MMMM YYYY h:mm a');
            }
        }
        return str;
    }

}
