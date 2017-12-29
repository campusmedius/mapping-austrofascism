import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'cm-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {

    currentLang$: Observable<string>;

    constructor(private translate: TranslateService) { }

    ngOnInit() {
        this.currentLang$ = this.translate.onLangChange.map((event: LangChangeEvent) => {
            return event.lang;
        });
    }

    public changeLanguage(lang: string) {
        this.translate.use(lang);
    }
}
