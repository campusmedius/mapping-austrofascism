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
import { SearchComponent } from './components/search/search';
import { SearchResultComponent } from './components/search-result/search-result';
import { SearchResultTextPipe } from './pipes/search-result-text.pipe';


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
    PageComponent,
    SearchComponent,
    SearchResultComponent,
    SearchResultTextPipe
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
    ],
    entryComponents: [
        SearchComponent
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
    return {
        ngModule: CoreModule,
        providers: [],
    };
}
}
