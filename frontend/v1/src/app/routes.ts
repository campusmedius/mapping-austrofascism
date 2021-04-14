import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/containers/not-found-page';

import { TopographyModule } from './topography/topography.module';


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
    {
        path: '**',
        redirectTo: 'about',
    }
];

