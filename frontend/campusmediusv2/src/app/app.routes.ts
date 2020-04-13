import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/components/not-found-page';

import { TopographyModule } from './topography/topography.module';
import { TopologyModule } from './topology/topology.module';


export function loadTopography() {
    return TopographyModule;
}

export function loadTopology() {
    return TopologyModule;
}

export const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'about',
    //     pathMatch: 'full'
    // },
    {
       path: 'topography',
       loadChildren: loadTopography
    },
    {
        path: 'topology',
        loadChildren: loadTopology
    },
    // {
    //     path: '**',
    //     redirectTo: 'about',
    // }
];

