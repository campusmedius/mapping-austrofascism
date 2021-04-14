import { makeStateKey, TransferState } from '@angular/platform-browser';
import { readFileSync } from 'fs';
import * as p from 'path';
import { TranslateLoader } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';

export class TranslateFsLoader implements TranslateLoader {
  constructor(
    // ADDED: inject the transferState service
    private transferState: TransferState,
    private prefix = 'i18n',
    private suffix = '.json'
  ) { }

  public getTranslation(lang: string): Observable<any> {
    const path = p.join(__dirname, '../browser/assets/', this.prefix, `${lang}${this.suffix}`);
    const data = JSON.parse(readFileSync(path, 'utf8'));
    // ADDED: store the translations in the transfer state:
    const key = makeStateKey<any>('transfer-translate-' + lang);
    this.transferState.set(key, data);
    return of(data);
  }
}