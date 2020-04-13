import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';

import { AppComponent } from '@app/core';
import { routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        CoreModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
