import { TranslateLoader } from '@ngx-translate/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export class TranslateBrowserLoader implements TranslateLoader {
    constructor(
      private transferState: TransferState,
      private http: HttpClient,
      private prefix: string = 'i18n',
      private suffix: string = '.json',
    ) { }
    
    public getTranslation(lang: string): Observable<any> {
      const key = makeStateKey<any>('transfer-translate-' + lang);
      const data = this.transferState.get(key, null);
      
      // First we are looking for the translations in transfer-state, if none found, http load as fallback
      return data
        ? of(data)
        : new TranslateHttpLoader(this.http, './assets/i18n/', '.json').getTranslation(lang);
    }
  }