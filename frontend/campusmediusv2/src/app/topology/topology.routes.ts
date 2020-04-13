import { Routes } from '@angular/router';
import { TopologyComponent } from './components/topology/topology';

export const routes: Routes = [
    {
        path: '',
        component: TopologyComponent,
        //resolve: {
        //    events: EventsResolver
        //},
        data: {
            reuse: true
        }
    }
];
