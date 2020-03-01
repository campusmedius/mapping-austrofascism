import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';

import { AppComponent } from '@app/core';
import { Routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        RouterModule.forRoot(Routes),
        CoreModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
