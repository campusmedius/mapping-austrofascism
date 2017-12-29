import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
        RouterModule,
        TranslateModule.forChild()
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS,
})
export class CoreModule {
    static forRoot() {
        return {
            ngModule: CoreModule,
            providers: [],
        };
    }
}
