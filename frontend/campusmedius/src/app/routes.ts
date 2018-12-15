import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/containers/not-found-page';

import { TopographyModule } from './topography/topography.module';
import { TopologyModule } from './topology/topology.module';
import { MedialityModule } from './mediality/mediality.module';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/topography/events/99',
        pathMatch: 'full'
    },
    {
        path: 'topography',
        loadChildren: () => TopographyModule
    },
    {
        path: 'topology',
        loadChildren: () => TopologyModule
    },
    {
        path: 'mediality',
        loadChildren: () => MedialityModule
    },
    { path: '**', component: NotFoundPageComponent }
];

