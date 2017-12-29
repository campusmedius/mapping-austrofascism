import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Event } from '../../models/event';

@Component({
    selector: 'cm-info-event-nav',
    templateUrl: './info-event-nav.html',
    styleUrls: ['./info-event-nav.scss']
})
export class InfoEventNavComponent implements OnInit {
    @Input() nextEvent: Event;
    @Input() previousEvent: Event;

    @Output() eventSelected = new EventEmitter<Event>();

    constructor(private translate: TranslateService) { }

    ngOnInit() {
    }

    select(event: Event) {
        this.eventSelected.emit(event);
    }

}
