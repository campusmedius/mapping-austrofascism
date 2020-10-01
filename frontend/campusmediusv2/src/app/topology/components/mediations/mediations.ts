import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { Mediation } from '@app/topology/models/mediation';
import { TranslateService } from '@ngx-translate/core';
import { Mediator } from '@app/topology/models/mediator';


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
    @Input() mediations: Mediation[];
    @Input() selectedMediation: Mediation;
    @Input() selectedMediator: Mediator;
    @Input() sidepanelState: string;

    @Output() height = new EventEmitter<string>();
    @Output() state = new EventEmitter<string>();
    @Output() focusedMediation = new EventEmitter<Mediation>();

    @HostBinding('@panel')
    public opened = true;

    public mediationsById = {};

    constructor(private translate: TranslateService) { }

    ngOnInit() {
        this.mediations.forEach((m) => {
            this.mediationsById[m.id] = m;
        });
    }


    ngAfterViewInit() {
        setTimeout(() => this.height.emit(this.opened ? OPENED_HEIGHT : CLOSED_HEIGHT));
    }

    public toggle() {
        this.opened = !this.opened;
        this.height.emit(this.opened ? OPENED_HEIGHT : CLOSED_HEIGHT);
        this.state.emit(this.opened ? 'open' : 'closed');
    }

    selectMediation(mediationId: string) {
        this.focusedMediation.emit(this.mediationsById[mediationId]);
    }
}
