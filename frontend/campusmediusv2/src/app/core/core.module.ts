import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './components/app/app.component';
import { NotFoundPageComponent } from './components/not-found-page';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

export const COMPONENTS = [
    AppComponent,
    NotFoundPageComponent,
    HeaderComponent
];

@NgModule({
    declarations: COMPONENTS,
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        TranslateModule.forChild()
    ],
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
