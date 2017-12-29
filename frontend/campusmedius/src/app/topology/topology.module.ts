import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { routes } from './routes';

import { TopologyComponent } from './containers/topology/topology';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TopologyComponent
    ]
})
export class TopologyModule { }
