import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { Mediator } from '@app/topology/models/mediator';
import { Mediation } from '@app/topology/models/mediation';

@Component({
    selector: 'cm-start-selector',
    templateUrl: './start-selector.html',
    styleUrls: ['./start-selector.scss']
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
