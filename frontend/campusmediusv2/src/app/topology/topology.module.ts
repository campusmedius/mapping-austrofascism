import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyComponent } from './components/topology/topology';
import { SharedModule } from '@app/shared/shared.module';
import { InformationModule } from '@app/information/information.module';
import { RouterModule } from '@angular/router';
import { routes } from './topology.routes';
import { MapComponent } from './components/map/map';

@NgModule({
    declarations: [
        TopologyComponent,
        MapComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        InformationModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [
    ],
    providers: []
})
export class TopologyModule { }
