import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { AppComponent } from './components/app/app';
import { StartPageComponent } from './components/start-page/start-page';
import { StartPageSelectorComponent } from './components/start-page-selector/start-page-selector';
import { TeamPageComponent } from './components/team-page/team-page';
import { AboutPageComponent } from './components/about-page/about-page';
import { NotFoundPageComponent } from './components/not-found-page';
import { SharedModule } from '@app/shared/shared.module';
import { InformationModule } from '@app/information/information.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';


export const COMPONENTS = [
    AppComponent,
    NotFoundPageComponent,
    HeaderComponent,
    StartPageComponent,
    StartPageSelectorComponent,
    TeamPageComponent,
    AboutPageComponent
];

@NgModule({
    declarations: COMPONENTS,
    imports: [
        CommonModule,
        InformationModule,
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
