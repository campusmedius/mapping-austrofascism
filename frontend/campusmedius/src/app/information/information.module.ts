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
import { CaptionComponent } from './components/caption/caption.component';
import { LinkExternComponent } from './components/link-extern/link-extern.component';
import { LinkInpageComponent } from './components/link-inpage/link-inpage.component';
import { LinkInternComponent } from './components/link-intern/link-intern.component';

import { InformationService } from './services/information';

import { TranslateModule } from '@ngx-translate/core';

import { NgxGalleryActionComponent } from './ngx-gallery/ngx-gallery-action.component';
import { NgxGalleryArrowsComponent } from './ngx-gallery/ngx-gallery-arrows.component';
import { NgxGalleryBulletsComponent } from './ngx-gallery/ngx-gallery-bullets.component';
import { NgxGalleryImageComponent } from './ngx-gallery/ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery/ngx-gallery-thumbnails.component';
import { NgxGalleryPreviewComponent } from './ngx-gallery/ngx-gallery-preview.component';
import { NgxGalleryComponent } from './ngx-gallery/ngx-gallery.component';

export const COMPONENTS = [
    InformationComponent,
    ImageComponent,
    AudioComponent,
    VideoComponent,
    GalleryComponent,
    QuoteComponent,
    NoteComponent,
    CaptionComponent,
    LinkExternComponent,
    LinkInpageComponent,
    LinkInternComponent,
    NgxGalleryActionComponent,
    NgxGalleryArrowsComponent,
    NgxGalleryBulletsComponent,
    NgxGalleryImageComponent,
    NgxGalleryThumbnailsComponent,
    NgxGalleryPreviewComponent,
    NgxGalleryComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FlexLayoutModule,
        ScrollToModule.forRoot(),

        /**
         * StoreModule.forFeature is used for composing state
         * from feature modules. These modules can be loaded
         * eagerly or lazily and will be dynamically added to
         * the existing state.
         */
        StoreModule.forFeature('information', reducers),

        TranslateModule.forChild(),
        RouterModule,
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
    entryComponents: [
        NoteComponent,
        QuoteComponent,
        GalleryComponent,
        ImageComponent,
        VideoComponent,
        AudioComponent,
        LinkInternComponent,
        LinkExternComponent,
        LinkInpageComponent
    ]
})
export class InformationModule { }
