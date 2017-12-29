import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'cm-app',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {

    constructor(private translate: TranslateService) {
        this.translate.addLangs(['en', 'de']);
        translate.setDefaultLang('de');
        const browserLang = translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
    }
}
