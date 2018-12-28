import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'cm-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
    host: { 'class': 'row header-row' }
})
export class HeaderComponent implements OnInit {

    currentLang$: Observable<string>;

    constructor(private translate: TranslateService,
        private router: Router,
        private elRef: ElementRef
    ) { }

    ngOnInit() {
        this.elRef.nativeElement.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        this.currentLang$ = this.translate.onLangChange.map((event: LangChangeEvent) => {
            return event.lang;
        });
    }

    public changeLanguage(lang: string) {
        this.router.navigate([], { queryParams: { 'lang': lang }, queryParamsHandling: 'merge' });
    }
}
