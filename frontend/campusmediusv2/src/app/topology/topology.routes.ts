import { Routes } from '@angular/router';
import { TopologyComponent } from './components/topology/topology';
import { MediatorsResolver, MediatorResolver } from './guards/mediator';

export const routes: Routes = [
    {
        path: 'mediators/:id',
        component: TopologyComponent,
        resolve: {
            mediators: MediatorsResolver,
            selectedMediator: MediatorResolver
        },
        data: {
            reuse: true
        }
    },
    {
        path: 'mediators',
        component: TopologyComponent,
        resolve: {
            mediators: MediatorsResolver
        },
        data: {
            reuse: true
        }
    }
];
