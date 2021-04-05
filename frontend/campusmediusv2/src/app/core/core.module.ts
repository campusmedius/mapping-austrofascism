import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { SearchService } from './services/search';
import { DisclosurePageComponent } from './components/disclosure-page/disclosure-page';


import {Compiler, COMPILER_OPTIONS, CompilerFactory} from '@angular/core';
import {JitCompilerFactory} from '@angular/platform-browser-dynamic';
export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}


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
    DisclosurePageComponent,
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
    providers: [
        SearchService
    ],
    exports: [
        ...COMPONENTS,
        SharedModule
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
    return {
        ngModule: CoreModule,
        providers: [
            {provide: COMPILER_OPTIONS, useValue: {}, multi: true},
            {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
            {provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory]}
        ],
    };
}
}
