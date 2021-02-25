import { Component, OnInit, Input, AfterViewInit, ViewChild, HostListener, ElementRef, OnDestroy, Inject } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@app/information/models/page';
import { MatDialog } from '@angular/material/dialog';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { InfoContainerComponent } from '@app/information/components/info-container/info-container';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { InfoContainerMobileComponent } from '@app/information/components/info-container-mobile/info-container-mobile';
import { AppComponent } from '../app/app';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'cm-page',
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  animations: [
    trigger('titleHeader', [
        state('false', style({ opacity: 0 })),
        state('true', style({ opacity: 1 })),
        transition('false <=> true', animate('300ms ease-in'))
    ])
  ]
})
export class PageComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() pageTitleEn: string;

    mediaSubscription: Subscription;
    queryParamsSubscription: Subscription;
    dataSubscription: Subscription;

    @ViewChild(InfoContainerComponent) infoContainer: InfoContainerComponent;
    @ViewChild(InfoContainerMobileComponent) infoContainerMobile: InfoContainerMobileComponent;

    public page: Page;
    public overviewPage: Page;
    isMobile: boolean;
    private galleryIsOpen = false;
    public showTitleHeader = false;
    public showTitleHeaderMobile = false;
    private scrollTopBeforeGalleryOpen = 0;
    private skipFragmentUpdate = false;

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router,
        private elementRef: ElementRef,
        private app: AppComponent,
        private mediaObserver: MediaObserver,
        private scrollToService: ScrollToService,
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
        this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
            setTimeout(() => this.updateSiteMetaAndTitle());
        });
        this.dataSubscription = this.route.data.subscribe(data => {
            this.page = data.pages.find(p => p.titleEn === this.pageTitleEn);
            this.overviewPage = data.pages.find(p => p.titleEn === 'Overview');
            this.updateSiteMetaAndTitle();
        });
    }

    private updateSiteMetaAndTitle() {
        let title;
        let keywords;
        let description;
        let canonicalUrl = "https://campusmedius.net";
        let alternateUrl;
        title = 'Campusmedius - ' + (this.translate.currentLang === 'de' ? this.page.titleDe : this.page.titleEn);
        keywords = (this.translate.currentLang === 'de' ? this.page.keywordsDe : this.page.keywordsEn);
        description = (this.translate.currentLang === 'de' ? this.page.abstractDe : this.page.abstractEn);

        if(this.page.titleEn === 'Overview') {
            canonicalUrl += '/overview';
        } else if(this.page.titleEn === 'Project Team') {
            canonicalUrl += '/team';
        } else if(this.page.titleEn === 'Book Edition') {
            canonicalUrl += '/book';
        }

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
    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            if (!this.skipFragmentUpdate) {
                setTimeout(() => {
                    fragment = fragment ? fragment : 'top';
                    let infoContainer = this.isMobile ? this.infoContainerMobile : this.infoContainer;
                    if (infoContainer) {
                        infoContainer.scrollToReference(fragment);
                    }

                    // set lang in url if not set
                    this.router.navigate(['.'], {
                        relativeTo: this.route,
                        queryParams: { 'lang': this.translate.currentLang },
                        queryParamsHandling: 'merge',
                        replaceUrl: true,
                        preserveFragment: true
                    });
                }, 0);
            } else {
                this.skipFragmentUpdate = false;
            }

        });
    }

    public showCite() {
        const dialogRef = this.dialog.open(CiteDialogComponent, {
            width: '800px',
            maxHeight: '90vh',
            data: { event: this.page },
            autoFocus: false
        });
    }

    public scrollUp() {
        this.infoContainer.scrollToReference('top', 650);
    }

    public sectionChange(section: string) {
        this.skipFragmentUpdate = true;
        this.router.navigate( [ ], { fragment: section, queryParams: { }, queryParamsHandling: 'merge', replaceUrl: true } );
    }

    @HostListener('scroll')
    private onMobileScroll() {
        if (this.galleryIsOpen) {
            return;
        }

        const scrollTop = this.elementRef.nativeElement.scrollTop;
        const clientHeight = this.elementRef.nativeElement.clientHeight;

        if (scrollTop < 170) {
            this.elementRef.nativeElement.scrollTop = 170;
        }
        
        if (scrollTop < (clientHeight + 150)) {
            if (this.showTitleHeaderMobile) {
                this.app.removeHeader = false;
                setTimeout(() => {
                    this.showTitleHeaderMobile = false;
                    this.app.showHeader = true;
                });
            }
        } else {
            if (!this.showTitleHeaderMobile) {
                this.showTitleHeaderMobile = true;
                this.app.showHeader = false;
                setTimeout(() => {
                    this.app.removeHeader = true;
                }, 300);
            }
        }

        if(this.infoContainerMobile) {
            this.infoContainerMobile.checkCurrentSection((scrollTop-clientHeight));
        }
    }

    public galleryClosed() {
        this.galleryIsOpen = false;
        if (!this.showTitleHeaderMobile) {
            this.app.removeHeader = false;
        }
        this.elementRef.nativeElement.scrollTop = this.scrollTopBeforeGalleryOpen;
    }

    public galleryOpened() {
        this.scrollTopBeforeGalleryOpen = this.elementRef.nativeElement.scrollTop;
        this.galleryIsOpen = true;
        this.app.removeHeader = true;
    }

    ngOnDestroy() { 
        this.dataSubscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
        this.mediaSubscription.unsubscribe();
    }
}
