import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, query, state } from '@angular/animations';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

declare var safari;

@Component({
    selector: 'cm-app',
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
    animations: [
        trigger('header', [
            state('0', style({ opacity: 0 })),
            state('1', style({ opacity: 1 })),
            transition('0 <=> 1', animate('300ms ease-in'))
        ])
    ]
})
export class AppComponent implements OnInit {

    public showHeader = true;
    public removeHeader = false;

    public lang: string;

    currentLang$: Observable<string>;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        (<any>document).isIE = /*@cc_on!@*/false || !!(<any>document).documentMode;
        (<any>document).isEdge = !(<any>document).isIE && !!(<any>window).StyleMedia;
        (<any>document).isSafari = /constructor/i.test((<any>window).HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        this.translate.addLangs(['en', 'de']);
        translate.setDefaultLang('de');

        let setLangTo = null;

        const queryLang = this.getParameterByName('lang', window.location.href.toLowerCase());
        if (queryLang && queryLang.match(/en|de/)) {
            setLangTo = queryLang;
        }

        if (!setLangTo) {
            if (this.translate.getBrowserLang().match(/en|de/)) {
                setLangTo = this.translate.getBrowserLang();
            }
        }

        setLangTo = setLangTo ? setLangTo : 'de';
        this.translate.use(setLangTo);
        this.lang = setLangTo;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams['lang'] && queryParams['lang'].match(/en|de/)) {
                this.translate.use(queryParams['lang']);
            }
        });
        this.currentLang$ = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.lang = event.lang;
        });
    }

    private getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}
