import { Routes } from '@angular/router';

import { TopographyModule } from './topography/topography.module';
import { TopologyModule } from './topology/topology.module';
import { StartPageComponent } from './core/components/start-page/start-page';
import { AboutPageComponent } from './core/components/about-page/about-page';
import { TeamPageComponent } from './core/components/team-page/team-page';
import { PagesResolver } from '@app/information/guards/page';
import { BookPageComponent } from './core/components/book-page/book-page';
import { DisclosurePageComponent } from './core/components/disclosure-page/disclosure-page';


export function loadTopography() {
    return TopographyModule;
}

export function loadTopology() {
    return TopologyModule;
}

export const routes: Routes = [
    {
        path: '',
        component: StartPageComponent,
        resolve: {
            pages: PagesResolver
        }
    },
    {
        path: 'overview',
        component: AboutPageComponent,
        resolve: {
            pages: PagesResolver
        }
    },
    {
        path: 'about',
        redirectTo: 'overview',
    },
    {
        path: 'team',
        component: TeamPageComponent,
        resolve: {
            pages: PagesResolver
        }
    },
    {
        path: 'disclosure',
        component: DisclosurePageComponent,
        resolve: {
            pages: PagesResolver
        }
    },
    {
        path: 'book',
        component: BookPageComponent,
        resolve: {
            pages: PagesResolver
        }
    },
    {
        path: 'topography',
        loadChildren: () => import('./topography/topography.module').then(m => m.TopographyModule)
     },
     {
         path: 'topology',
         loadChildren: () => import('./topology/topology.module').then(m => m.TopologyModule)
     },
    {
        path: '**',
        redirectTo: '',
    }
];
