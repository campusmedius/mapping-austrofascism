import { Routes } from '@angular/router';
import { TopologyComponent } from './components/topology/topology';
import { MediatorsResolver, MediatorResolver } from './guards/mediator';
import { MediationsResolver, MediationResolver } from './guards/mediation';
import { PagesResolver } from '@app/information/guards/page';

export const routes: Routes = [
    {
        path: '',
        component: TopologyComponent,
        resolve: {
            mediators: MediatorsResolver,
            mediations: MediationsResolver,
            pages: PagesResolver
        },
        data: {
            reuse: true
        }
    },
    {
        path: 'mediations/:mediationId/mediators/:mediatorId',
        component: TopologyComponent,
        resolve: {
            mediations: MediationsResolver,
            selectedMediation: MediationResolver,
            mediators: MediatorsResolver,
            selectedMediator: MediatorResolver
        },
        data: {
            reuse: false
        }
    }
];
