import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { Mediation } from '@app/topology/models/mediation';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


const OPENED_HEIGHT = '220px';
const CLOSED_HEIGHT = '40px';


@Component({
  selector: 'cm-mediations',
  templateUrl: './mediations.html',
    styleUrls: ['./mediations.scss'],
    host: {
        '[class.open]': 'opened'
    },
    animations: [
        trigger('panelControl', [
            state('true', style({ transform: 'scaleY(1)' })),
            state('false', style({ transform: 'scaleY(-1)' })),
            transition('false <=> true', animate('300ms ease-in'))
        ]),
        trigger('panel', [
            state('true', style({ height: OPENED_HEIGHT })),
            state('false', style({ height: CLOSED_HEIGHT })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class MediationsComponent implements OnInit, AfterViewInit {
    @Input() selectedMediation: Mediation;

    @Output() height = new EventEmitter<string>();

    @HostBinding('@panel')
    public opened = true;

    constructor(private translate: TranslateService) { }

    ngOnInit() {
    }


    ngAfterViewInit() {
        setTimeout(() => this.height.emit(this.opened ? OPENED_HEIGHT : CLOSED_HEIGHT));
    }

    public toggle() {
        this.opened = !this.opened;
        this.height.emit(this.opened ? OPENED_HEIGHT : CLOSED_HEIGHT);
    }
}
