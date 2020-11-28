import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';
import { SidepanelComponent } from './components/sidepanel/sidepanel';
import { AppComponent } from './components/app/app';
import { StartPageComponent } from './components/start-page/start-page';
import { StartPageSelectorComponent } from './components/start-page-selector/start-page-selector';
import { TeamPageComponent } from './components/team-page/team-page';
import { BookPageComponent } from './components/book-page/book-page';
import { AboutPageComponent } from './components/about-page/about-page';
import { NotFoundPageComponent } from './components/not-found-page';
import { SharedModule } from '@app/shared/shared.module';
import { InformationModule } from '@app/information/information.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from './components/page/page';


export const COMPONENTS = [
    AppComponent,
    NotFoundPageComponent,
    HeaderComponent,
    SidepanelComponent,
    StartPageComponent,
    StartPageSelectorComponent,
    TeamPageComponent,
    BookPageComponent,
    AboutPageComponent,
    PageComponent
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
