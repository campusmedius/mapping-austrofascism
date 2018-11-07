import { Routes } from '@angular/router';

import { TopographyComponent } from './containers/topography/topography';
import { EventResolver } from './guards/event';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'events'
    }, {
        path: 'events',
        component: TopographyComponent,
        resolve: { loaded: EventResolver }
    }, {
        path: 'events/:eventId',
        component: TopographyComponent,
        resolve: { loaded: EventResolver }
    }
];
