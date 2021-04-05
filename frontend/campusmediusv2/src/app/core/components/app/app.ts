import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

declare var safari;

@Component({
    selector: 'cm-app',
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
    animations: [
        trigger('header', [
            state('false', style({ opacity: 0 })),
            state('true', style({ opacity: 1 })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class AppComponent implements OnInit, OnDestroy {

    public showHeader = true;
    public removeHeader = false;

    public lang: string;

    currentLangSubscription: Subscription;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        @Inject(DOCUMENT) private _doc: Document,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        if (isPlatformBrowser(this.platformId)) {
            (<any>document).isIE = /*@cc_on!@*/false || !!(<any>document).documentMode;
            (<any>document).isEdge = !(<any>document).isIE && !!(<any>window).StyleMedia;
            (<any>document).isSafari = /constructor/i.test((<any>window).HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
            
            let vh = (<any>window).innerHeight * 0.01;
            (<any>document).documentElement.style.setProperty('--vh', `${vh}px`);
            window.addEventListener('resize', () => {
                // We execute the same script as before
                let vh = (<any>window).innerHeight * 0.01;
                (<any>document).documentElement.style.setProperty('--vh', `${vh}px`);
            });

            (window as any).skipSectionChange = 0;
        }
        

        moment.updateLocale('en', {
            meridiem: function(hour, minute, isLowerCase) {
              if (hour < 12) {
                return 'a.m.';
              } else {
                return 'p.m.';
              }
            }
          });

        this.translate.addLangs(['en', 'de']);
        translate.setDefaultLang('de');

        let setLangTo = null;

        const queryLang = this.getParameterByName('lang', this._doc.location.href.toLowerCase()) || '';
        if (queryLang && queryLang.match(/en|de/)) {
            setLangTo = queryLang;
        }

        if (isPlatformBrowser(this.platformId) && !setLangTo) {
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
        this.currentLangSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.lang = event.lang;
        });
    }

    ngOnDestroy() {
        this.currentLangSubscription.unsubscribe();
    }

    private getParameterByName(name, url) {
        if (!url) {
            url = this._doc.location.href;
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


