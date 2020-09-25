import { Routes } from '@angular/router';
import { TopographyComponent } from './components/topography/topography';
import { EventsResolver, EventResolver } from './guards/event';

export const routes: Routes = [
    {
        path: 'events/:id',
        component: TopographyComponent,
        resolve: {
            events: EventsResolver,
            selectedEvent: EventResolver
        },
        data: {
            reuse: true
        }

    },
    {
        path: '',
        component: TopographyComponent,
        resolve: {
            events: EventsResolver
        },
        data: {
            reuse: true
        }
    }
];
