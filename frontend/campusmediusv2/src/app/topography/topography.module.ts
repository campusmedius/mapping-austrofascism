import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { InformationModule } from '@app/information/information.module';
import { CoreModule } from '@app/core/core.module';

import { TopographyComponent } from './components/topography/topography';
import { MapComponent } from './components/map/map';
import { MapEventComponent } from './components/map-event/map-event.component';
import { TimelineComponent } from './components/timeline/timeline';
import { TimelineMobileComponent } from './components/timeline-mobile/timeline-mobile';
import { InfoEventNavComponent } from './components/info-event-nav/info-event-nav';

import { EventService } from './services/events';

import { InfoTimestampPipe } from './pipes/info-timestamp.pipe';

import { routes } from './topography.routes';

import { EventsResolver, EventResolver } from './guards/event';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        SharedModule,
        InformationModule,

        RouterModule.forChild(routes)
    ],
    declarations: [
        TopographyComponent,
        MapComponent,
        TimelineComponent,
        TimelineMobileComponent,
        MapEventComponent,
        InfoEventNavComponent,
        InfoTimestampPipe,
    ],
    entryComponents: [
    ],
    providers: [
        EventService,
        EventsResolver,
        EventResolver
    ]
})
export class TopographyModule { }
