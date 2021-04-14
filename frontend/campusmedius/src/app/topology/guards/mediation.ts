import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Mediation } from '../models/mediation';
import { MediationService } from '../services/mediations';
import { MediatorService } from '../services/mediators';

@Injectable()
export class MediationsResolver implements Resolve<Mediation[]> {
    constructor(private mediationService: MediationService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.mediationService.mediations;
    }
}

@Injectable()
export class MediationResolver implements Resolve<Mediation> {
    constructor(private mediatorService: MediatorService,
                private mediationService: MediationService) { }

    resolve(route: ActivatedRouteSnapshot) {
        const id = route.paramMap.get('mediationId');
        return this.mediationService.mediation(id).pipe(
            switchMap(mediation => {
                return forkJoin({
                    mediators: this.mediatorService.mediators,
                }).pipe(
                    map(results => {
                        mediation.relations.forEach(m => {
                            m.source = results.mediators.find(ms => ms.id === m.sourceId);
                            m.target = results.mediators.find(ms => ms.id === m.targetId);
                        });
                        return mediation;
                    })
                );
            })
        );
    }
}
