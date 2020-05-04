import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyComponent } from './components/topology/topology';
import { SharedModule } from '@app/shared/shared.module';
import { InformationModule } from '@app/information/information.module';
import { RouterModule } from '@angular/router';
import { routes } from './topology.routes';
import { MapComponent } from './components/map/map';
import { MediatorService } from './services/mediators';
import { MediatorsResolver, MediatorResolver } from './guards/mediator';
import { MediationService } from './services/mediations';
import { MediationsResolver, MediationResolver } from './guards/mediation';
import { MapMediatorComponent } from './components/map-mediator/map-mediator.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        InformationModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        TopologyComponent,
        MapComponent,
        MapMediatorComponent,
    ],
    entryComponents: [
    ],
    providers: [
        MediatorService,
        MediatorsResolver,
        MediatorResolver,
        MediationService,
        MediationsResolver,
        MediationResolver
    ]
})
export class TopologyModule { }
