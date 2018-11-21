import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';

import { InformationComponent } from './components/information/information.component';
import { ImageComponent } from './components/image/image.component';
import { VideoComponent } from './components/video/video.component';
import { AudioComponent } from './components/audio/audio.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { QuoteComponent } from './components/quote/quote.component';
import { NoteComponent } from './components/note/note.component';

import { InformationService } from './services/information';

import { TranslateModule } from '@ngx-translate/core';

export const COMPONENTS = [
    InformationComponent,
    ImageComponent,
    AudioComponent,
    VideoComponent,
    GalleryComponent,
    QuoteComponent,
    NoteComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FlexLayoutModule,
        RouterModule,
        ScrollToModule.forRoot(),

        /**
         * StoreModule.forFeature is used for composing state
         * from feature modules. These modules can be loaded
         * eagerly or lazily and will be dynamically added to
         * the existing state.
         */
        StoreModule.forFeature('information', reducers),

        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    exports: [
        ...COMPONENTS,
        FlexLayoutModule,
        TranslateModule,
        RouterModule,
        ScrollToModule
    ],
    providers: [
        InformationService
    ],
    entryComponents: []
})
export class InformationModule { }
