import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'cm-start-page',
  templateUrl: './start-page.html',
  styleUrls: ['./start-page.scss']
})
export class StartPageComponent implements OnInit {

    public page: Page;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
          this.route.data.subscribe(data => {
              this.page = data.pages.find(p => p.titleEn === 'Overview');
          });
    }
}
