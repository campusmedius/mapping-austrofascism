import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/containers/not-found-page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/topography/events',
        pathMatch: 'full'
    },
    {
        path: 'topography',
        loadChildren: './topography/topography.module#TopographyModule'
    },
    {
        path: 'topology',
        loadChildren: './topology/topology.module#TopologyModule'
    },
    {
        path: 'mediality',
        loadChildren: './mediality/mediality.module#MedialityModule'
    },
    { path: '**', component: NotFoundPageComponent }
];
