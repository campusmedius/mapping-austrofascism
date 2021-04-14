import { BrowserModule, BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, Injectable, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TransferHttpCacheModule} from '@nguniversal/common';
import { RouterModule, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

import { CoreModule } from './core/core.module';

import { AppComponent } from '@app/core';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateFsLoader } from './translateFsLoader';
import { TranslateBrowserLoader } from './translateBrowserLoader';

export function translateLoaderFactory(httpClient: HttpClient, transferState: TransferState, platform: any) {
    return isPlatformBrowser(platform)
      ? new TranslateBrowserLoader(transferState, httpClient)
      : new TranslateFsLoader(transferState);
  }

@Injectable()
export class CustomRouteReuseStrategy extends RouteReuseStrategy {
    public shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
    public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void { }
    public shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle { return null; }
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return (future.routeConfig === curr.routeConfig) || future.data.reuse;
    }
}

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false }
  } as any;
}

@NgModule({
     imports: [
        CommonModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        HttpClientModule,
        TransferHttpCacheModule,
        BrowserTransferStateModule,

        CoreModule.forRoot(),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: translateLoaderFactory,
                deps: [HttpClient, TransferState, PLATFORM_ID]
            }
        }),

        RouterModule.forRoot(routes, {
            useHash: false,
            anchorScrolling: 'enabled',
            relativeLinkResolution: 'legacy'
        })
    ],
    providers: [
        {
            provide: RouteReuseStrategy,
            useClass: CustomRouteReuseStrategy
        },
        { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
    ],
    bootstrap: [AppComponent],
    declarations: []
})
 export class AppBrowserModule { }
