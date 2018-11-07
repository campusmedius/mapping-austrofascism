import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './containers/header/header';
import { AppComponent } from './containers/app/app';
import { NotFoundPageComponent } from './containers/not-found-page';

import { TranslateModule } from '@ngx-translate/core';

export const COMPONENTS = [
    AppComponent,
    NotFoundPageComponent,
    HeaderComponent
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    exports: [
        ...COMPONENTS,
        SharedModule
    ]
})
export class CoreModule {
    static forRoot() {
        return {
            ngModule: CoreModule,
            providers: [],
        };
    }
}
