import { Routes } from '@angular/router';
import { TopographyComponent } from './components/topography/topography';
import { EventsResolver, EventResolver } from './guards/event';
import { PagesResolver } from '@app/information/guards/page';

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
            events: EventsResolver,
            pages: PagesResolver
        },
        data: {
            reuse: true
        }
    }
];
