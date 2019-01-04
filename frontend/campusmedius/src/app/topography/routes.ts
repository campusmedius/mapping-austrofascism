import { Routes } from '@angular/router';

import { TopographyComponent } from './containers/topography/topography';
import { EventResolver } from './guards/event';
import { AboutTeamResolver } from './guards/about-team';

export const routes: Routes = [
    {
        path: 'about',
        component: TopographyComponent,
        resolve: { loaded: EventResolver },
        data: {
            reuse: true
        }
    },
    {
        path: 'team',
        component: TopographyComponent,
        resolve: { loaded: EventResolver },
        data: {
            reuse: true
        }
    },
    {
        path: 'topography',
        pathMatch: 'full',
        redirectTo: 'topography/events/1'
    }, {
        path: 'topography/events',
        pathMatch: 'full',
        redirectTo: 'topography/events/1'
    }, {
        path: 'topography/events/:eventId',
        component: TopographyComponent,
        resolve: { loaded: EventResolver },
        data: {
            reuse: true
        }
    }
];
