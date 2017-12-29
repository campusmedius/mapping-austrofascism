import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { TopographyComponent } from './containers/topography/topography';
import { TimelineComponent } from './components/timeline/timeline';
import { InfoEventNavComponent } from './components/info-event-nav/info-event-nav';

import { EventService } from './services/events';
import { InformationService } from './services/information';

import { routes } from './routes';

import { reducers } from './reducers';

import { EventEffects } from './effects/event';
import { InformationEffects } from './effects/information';
import { MapEventComponent } from './components/map-event/map-event.component';
import { InfoTimestampPipe } from './pipes/info-timestamp.pipe';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),

        /**
         * StoreModule.forFeature is used for composing state
         * from feature modules. These modules can be loaded
         * eagerly or lazily and will be dynamically added to
         * the existing state.
         */
        StoreModule.forFeature('topography', reducers),

        /**
         * Effects.forFeature is used to register effects
         * from feature modules. Effects can be loaded
         * eagerly or lazily and will be started immediately.
         *
         * All Effects will only be instantiated once regardless of
         * whether they are registered once or multiple times.
         */
        EffectsModule.forFeature([EventEffects, InformationEffects])
    ],
    declarations: [
        TopographyComponent,
        TimelineComponent,
        MapEventComponent,
        InfoEventNavComponent,
        InfoTimestampPipe
    ],
    providers: [
        EventService,
        InformationService
    ]
})
export class TopographyModule { }
