import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Page } from '@app/information/models/page';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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
        private router: Router,
        @Inject(DOCUMENT) private document: Document,
        private meta: Meta,
        public title: Title
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
              this.updateSiteMetaAndTitle();
          });
    }

    private updateSiteMetaAndTitle() {
        let title;
        let keywords;
        let description;
        let canonicalUrl = "https://campusmedius.net";
        let alternateUrl;
        title = 'Campusmedius';
        keywords = (this.translate.currentLang === 'de' ? this.page.keywordsDe : this.page.keywordsEn);
        description = (this.translate.currentLang === 'de' ? this.page.abstractDe : this.page.abstractEn);
        alternateUrl = canonicalUrl + '?lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
        canonicalUrl += '?lang=' + this.translate.currentLang;
        
        this.title.setTitle(title);
        this.document.documentElement.lang = this.translate.currentLang; 
        this.meta.updateTag({name: 'keywords', content: keywords.join(',')});
        this.meta.updateTag({name: 'description', content: description, lang: this.translate.currentLang});

        let canonicalLink: HTMLLinkElement = this.document.querySelector('link[rel=canonical]');
        canonicalLink.setAttribute('href', canonicalUrl);

        let alternateLink: HTMLLinkElement = this.document.querySelector('link[rel=alternate]');
        alternateLink.setAttribute('href', alternateUrl);
        alternateLink.setAttribute('hreflang', this.translate.currentLang);

        this.meta.updateTag({name: 'og:title', content: title});
        this.meta.updateTag({name: 'og:description', content: description});
        this.meta.updateTag({name: 'og:type', content: 'website'});
        this.meta.updateTag({name: 'og:url', content: canonicalUrl});
        this.meta.updateTag({name: 'og:image', content: "https://campusmedius.net/assets/screenshot.jpg"});
        this.meta.updateTag({name: 'og:site_name', content: "Campus Medius"});
        this.meta.updateTag({name: 'twitter:card', content: "summary"});

        let jsonLdScript = <HTMLScriptElement>this.document.getElementById('jsonld');
        jsonLdScript.text = "";
    }

    readMore() {
      this.router.navigate(['/about'], { queryParamsHandling: 'merge' });
    }

    mobileShowMore() {
    }
}
