import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/containers/not-found-page';

import { TopographyModule } from './topography/topography.module';
import { TopologyModule } from './topology/topology.module';
import { MedialityModule } from './mediality/mediality.module';


export function loadTopography() {
    return TopographyModule;
}

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'about',
        pathMatch: 'full'
    },
    {
        path: '',
        loadChildren: loadTopography
    },
    // {
    //     path: 'topology',
    //     loadChildren: () => TopologyModule
    // },
    // {
    //     path: 'mediality',
    //     loadChildren: () => MedialityModule
    // },
    {
        path: '**',
        redirectTo: 'about',
    }
];

