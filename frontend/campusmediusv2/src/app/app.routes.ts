import { Routes } from '@angular/router';

import { TopographyModule } from './topography/topography.module';
import { TopologyModule } from './topology/topology.module';
import { StartPageComponent } from './core/components/start-page/start-page';
import { AboutPageComponent } from './core/components/about-page/about-page';
import { TeamPageComponent } from './core/components/team-page/team-page';


export function loadTopography() {
    return TopographyModule;
}

export function loadTopology() {
    return TopologyModule;
}

export const routes: Routes = [
    {
        path: '',
        component: StartPageComponent
    },
    {
        path: 'about',
        component: AboutPageComponent
    },
    {
        path: 'team',
        component: TeamPageComponent
    },
    {
       path: 'topography',
       loadChildren: loadTopography
    },
    {
        path: 'topology',
        loadChildren: loadTopology
    },
    {
        path: '**',
        redirectTo: '',
    }
];

