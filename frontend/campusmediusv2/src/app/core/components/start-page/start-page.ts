import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Page } from '@app/information/models/page';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cm-start-page',
  templateUrl: './start-page.html',
  styleUrls: ['./start-page.scss']
})
export class StartPageComponent implements OnInit {

    public page: Page;
    isMobile: boolean;
    mediaSubscription: Subscription;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private mediaObserver: MediaObserver,
        private router: Router
    ) { 
      this.mediaSubscription = this.mediaObserver.media$.subscribe((change: MediaChange) => {
        if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    });

    }

    ngOnInit() {
          this.route.data.subscribe(data => {
              this.page = data.pages.find(p => p.titleEn === 'Overview');
          });
    }

    readMore() {
      this.router.navigate(['/about'], { queryParamsHandling: 'merge' });
    }

    mobileShowMore() {
    }
}
