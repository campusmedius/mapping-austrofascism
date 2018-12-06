import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxGalleryModule } from '../ngx-gallery';


import { TranslateModule } from '@ngx-translate/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog'

export const COMPONENTS = [
];

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        NgxGalleryModule,
        TranslateModule.forChild(),
    ],
    declarations: COMPONENTS,
    exports: [
        ...COMPONENTS,
        FlexLayoutModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        NgxGalleryModule,
        TranslateModule
    ],
    entryComponents: []
})
export class SharedModule { }
