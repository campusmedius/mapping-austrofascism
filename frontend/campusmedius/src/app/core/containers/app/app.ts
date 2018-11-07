import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cm-app',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute
    ) {
        this.translate.addLangs(['en', 'de']);
        translate.setDefaultLang('de');

        let setLangTo = null;
        if (this.route.snapshot.queryParams['lang'] && this.route.snapshot.queryParams['lang'].match(/en|de/)) {
            setLangTo = this.route.snapshot.queryParams['lang'];
        }

        if (!setLangTo) {
            if (translate.getBrowserLang().match(/en|de/)) {
                setLangTo = translate.getBrowserLang();
            };
        }

        this.translate.use(setLangTo ? setLangTo : 'en');
    }

    ngOnInit() {
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams['lang'] && queryParams['lang'].match(/en|de/)) {
                this.translate.use(queryParams['lang']);
            }
        });
    }
}
