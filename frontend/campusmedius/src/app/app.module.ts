import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CoreModule } from './core/core.module';
import { TopographyModule } from './topography/topography.module';
import { TopologyModule } from './topology/topology.module';
import { MedialityModule } from './mediality/mediality.module';

import { routes } from './routes';
import { reducers, metaReducers } from './core/reducers';
import { CustomRouterStateSerializer } from './shared/utils';

import { AppComponent } from './core/containers/app/app';
import { environment } from '../environments/environment';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,

        RouterModule.forRoot(routes, { useHash: true }),

        /**
         * StoreModule.forRoot is imported once in the root module, accepting a reducer
         * function or object map of reducer functions. If passed an object of
         * reducers, combineReducers will be run creating your application
         * meta-reducer. This returns all providers for an @ngrx/store
         * based application.
         */
        StoreModule.forRoot(reducers, { metaReducers }),

        /**
         * @ngrx/router-store keeps router state up-to-date in the store.
         */
        StoreRouterConnectingModule,

        /**
         * Store devtools instrument the store retaining past versions of state
         * and recalculating new states. This enables powerful time-travel
         * debugging.
         *
         * To use the debugger, install the Redux Devtools extension for either
         * Chrome or Firefox
         *
         * See: https://github.com/zalmoxisus/redux-devtools-extension
         */
        !environment.production ? StoreDevtoolsModule.instrument() : [],

        /**
         * EffectsModule.forRoot() is imported once in the root module and
         * sets up the effects class to be initialized immediately when the
         * application starts.
         *
         * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
         */
        EffectsModule.forRoot([]),

        CoreModule.forRoot(),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        /**
 * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
 * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
 * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
 */
        { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
