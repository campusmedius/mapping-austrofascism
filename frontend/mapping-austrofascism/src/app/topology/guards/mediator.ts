import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InformationService } from '@app/information/services/information';
import { switchMap, map } from 'rxjs/operators';
import { Mediator } from '../models/mediator';
import { MediatorService } from '../services/mediators';

@Injectable()
export class MediatorsResolver implements Resolve<Mediator[]> {
    constructor(private mediatorService: MediatorService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.mediatorService.mediators;
    }
}

@Injectable()
export class MediatorResolver implements Resolve<Mediator> {
    constructor(private mediatorService: MediatorService,
                private informationService: InformationService) { }

    resolve(route: ActivatedRouteSnapshot) {
        const id = route.paramMap.get('mediatorId');
        return this.mediatorService.mediator(id).pipe(
            switchMap(mediator => {
                return forkJoin({
                    mediators: this.mediatorService.mediators,
                    information: this.informationService.information(mediator.informationId)
                }).pipe(
                    map(results => {
                        mediator.relationsFrom.forEach(m => {
                            m.source = results.mediators.find(ms => ms.id === m.sourceId);
                            m.target = results.mediators.find(ms => ms.id === m.targetId);
                        });
                        mediator.relationsTo.forEach(m => {
                            m.source = results.mediators.find(ms => ms.id === m.sourceId);
                            m.target = results.mediators.find(ms => ms.id === m.targetId);
                        });
                        mediator.information = results.information;
                        return mediator;
                    })
                );
            })
        );
    }
}
