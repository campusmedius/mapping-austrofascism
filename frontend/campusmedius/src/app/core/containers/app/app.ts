import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style, query, state } from '@angular/animations';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        (<any>document).isIE = /*@cc_on!@*/false || !!(<any>document).documentMode;
        (<any>document).isEdge = !(<any>document).isIE && !!(<any>window).StyleMedia;

        this.translate.addLangs(['en', 'de']);
        translate.setDefaultLang('de');

        let setLangTo = null;
        if (this.route.snapshot.queryParams['lang'] && this.route.snapshot.queryParams['lang'].match(/en|de/)) {
            setLangTo = this.route.snapshot.queryParams['lang'];
        }

        if (!setLangTo) {
            if (translate.getBrowserLang().match(/en|de/)) {
                setLangTo = translate.getBrowserLang();
            }
        }

        setLangTo = setLangTo ? setLangTo : 'en';
        this.translate.use(setLangTo);
    }

    ngOnInit() {
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams['lang'] && queryParams['lang'].match(/en|de/)) {
                this.translate.use(queryParams['lang']);
            }
        });
    }
}
