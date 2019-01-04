import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { StripHtmlPipe } from './pipes/strip-html.pipe';

export const COMPONENTS = [
    SanitizeHtmlPipe,
    StripHtmlPipe
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
        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    exports: [
        ...COMPONENTS,
        FlexLayoutModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        TranslateModule
    ],
    entryComponents: []
})
export class SharedModule { }
