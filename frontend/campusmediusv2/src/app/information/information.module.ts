import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { SharedModule } from '../shared/shared.module';

import { InfoContainerComponent } from './components/info-container/info-container';
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
import { CiteDialogComponent } from './components/cite-dialog/cite-dialog.component';

import { InformationService } from './services/information';
import { PageService } from './services/page';

import { PagesResolver } from './guards/page';

import { TranslateModule } from '@ngx-translate/core';

import { NgxGalleryActionComponent } from './ngx-gallery/ngx-gallery-action/ngx-gallery-action.component';
import { NgxGalleryArrowsComponent } from './ngx-gallery/ngx-gallery-arrows/ngx-gallery-arrows.component';
import { NgxGalleryBulletsComponent } from './ngx-gallery/ngx-gallery-bullets/ngx-gallery-bullets.component';
import { NgxGalleryImageComponent } from './ngx-gallery/ngx-gallery-image/ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery/ngx-gallery-thumbnails/ngx-gallery-thumbnails.component';
import { NgxGalleryPreviewComponent } from './ngx-gallery/ngx-gallery-preview/ngx-gallery-preview.component';
import { NgxGalleryComponent } from './ngx-gallery/ngx-gallery.component';

export const COMPONENTS = [
    InfoContainerComponent,
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
    CiteDialogComponent,
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

        TranslateModule.forChild(),
        RouterModule,
    ],
    declarations: COMPONENTS,
    exports: [
        ...COMPONENTS,
        FlexLayoutModule,
        TranslateModule,
        ScrollToModule
    ],
    providers: [
        InformationService,
        PageService,
        PagesResolver
    ]
})
export class InformationModule { }
