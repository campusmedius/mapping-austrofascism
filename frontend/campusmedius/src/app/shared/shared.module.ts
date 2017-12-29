import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoInformationComponent } from './components/info-information/info-information.component';
import { InfoGalleryComponent } from './components/info-gallery/info-gallery.component';
import { InfoAudioComponent } from './components/info-audio/info-audio.component';
import { InfoImageComponent } from './components/info-image/info-image.component';
import { InfoVideoComponent } from './components/info-video/info-video.component';
import { MapComponent } from './components/map/map';

import { TranslateModule } from '@ngx-translate/core';

export const COMPONENTS = [
    MapComponent,
    InfoInformationComponent,
    InfoGalleryComponent,
    InfoVideoComponent,
    InfoAudioComponent,
    InfoImageComponent
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    exports: [
        ...COMPONENTS,
        TranslateModule
    ],
    entryComponents: [InfoImageComponent]
})
export class SharedModule { }
