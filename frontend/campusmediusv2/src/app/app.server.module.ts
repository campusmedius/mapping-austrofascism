import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';

import { AppBrowserModule } from './app.module';
import { AppComponent } from './core/components/app/app';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    AppBrowserModule,
    ServerModule,
    // ServerTransferStateModule, // events can not be seralized properly
    FlexLayoutServerModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
