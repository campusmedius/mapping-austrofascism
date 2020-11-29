import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';
import { Mediator } from '@app/topology/models/mediator';
import { Mediation } from '@app/topology/models/mediation';

@Component({
    selector: 'cm-start-selector',
    templateUrl: './start-selector.html',
    styleUrls: ['./start-selector.scss'],
    animations: [
        trigger('med1Blur', [
            state('2', style({ opacity: '0.5' })),
            state('3', style( {opacity: '0.5' })),
            transition('* <=> *', animate('200ms ease-in'))
        ]),
        trigger('med2Blur', [
            state('1', style({ opacity: '0.5' })),
            state('3', style( {opacity: '0.5' })),
            transition('* <=> *', animate('200ms ease-in'))
        ]),
        trigger('med3Blur', [
            state('1', style({ opacity: '0.5' })),
            state('2', style( {opacity: '0.5' })),
            transition('* <=> *', animate('200ms ease-in'))
        ])
      ]
})
export class StartSelectorComponent implements OnInit {

    @Input() mediators: Mediator[];
    @Input() mediations: Mediation[];
    @Input() selectedMediationId: string;
    @Input() lang: string;

    @HostBinding('style.right')
    @Input() overlayRightSize = '0px';

    @HostBinding('style.bottom')
    @Input() overlayBottomSize = '0px';

    @Output() focusedMediation = new EventEmitter<Mediation>();
    @Output() focusedMediator = new EventEmitter<Mediator>();

    public mediationsById = {};

    constructor() { }

    ngOnInit() {
        this.mediations.forEach((m) => {
            this.mediationsById[m.id] = m;
        });
    }

    selectMediation(mediationId: string) {
        this.selectedMediationId = mediationId;
        this.focusedMediation.emit(this.mediationsById[mediationId]);
    }

    selectMediator(mediator: Mediator) {
        this.focusedMediator.emit(mediator);
    }

}
