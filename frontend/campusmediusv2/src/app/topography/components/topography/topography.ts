import {
    Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef, AfterViewInit, PLATFORM_ID, Inject
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { Subscription } from 'rxjs';

import { AppComponent } from '@app/core/components/app/app';
import { MapComponent } from '../../components/map/map';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';

import { Information } from '../../../information/models/information';
import { Page } from '@app/information/models/page';

import { Event } from '../../models/event';

import { Moment } from 'moment';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { InfoContainerComponent } from '@app/information/components/info-container/info-container';
import { InfoContainerMobileComponent } from '@app/information/components/info-container-mobile/info-container-mobile';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

const SIDEPANEL_WIDTH = {
    full: '70%',
    short: '470px',
};


@Component({
    selector: 'cm-topography',
    templateUrl: './topography.html',
    styleUrls: ['./topography.scss'],
    animations: [
        trigger('sidenav', [
            state('full', style({ width: SIDEPANEL_WIDTH.full })),
            state('short', style({ width: SIDEPANEL_WIDTH.short })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('infoEventNav', [
            state('full', style({ right: '50px' })),
            state('short', style({ right: '0px' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('timeline', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.full + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.short + ')' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('titleHeader', [
            state('false', style({ opacity: 0 })),
            state('true', style({ opacity: 1 })),
            transition('false <=> true', animate('300ms ease-in'))
        ])
    ]
})
export class TopographyComponent implements OnInit, OnDestroy, AfterViewInit {
    public events: Event[];
    public selectedEvent: Event;
    public nextEvent: Event;
    public previousEvent: Event;
    public information: Information;
    public page: Page;

    dataSubscription: Subscription;
    queryParamsSubscription: Subscription;
    mediaSubscription: Subscription;

    filteredIdsSubscription: Subscription;
    selectedEventsSubscription: Subscription;
    isMobile: boolean;
    filteredIds: string[] = [];
    timeFilterStart: Moment = moment('1933-05-13T13:00Z');
    timeFilterEnd: Moment = moment('1933-05-14T13:00Z');
    sidepanelState = 'short'; // full, short
    sidepanelWidth: string;
    
    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild('fullinfo') fullinfo: ElementRef;
    @ViewChild(InfoContainerComponent) infoContainer: InfoContainerComponent;
    @ViewChild(InfoContainerMobileComponent) infoContainerMobile: InfoContainerMobileComponent;

    public showTitleHeader = false;
    public showTitleHeaderMobile = false;
    private galleryIsOpen = false;
    private scrollTopBeforeGalleryOpen = 0;
    private skipFragmentUpdate = false;

    public timelineHeight = '40px';
    public mobileOverlayHeight = '125px';
    public mobileOverlayAboutHeight = '300px';
    public mobileOverlayDefaultHeight = '200px';

    public mobileAbstractDe = '<p><i>Campus Medius</i> erforscht und erweitert die Möglichkeiten digitalen Mappings in den Kultur- und Medienwissenschaften.</p>';
    public mobileAbstractEn = '<p><i>Campus Medius</i> explores and expands the possibilities of digital mapping in cultural and media studies.</p>';

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private mediaObserver: MediaObserver,
        private elementRef: ElementRef,
        private app: AppComponent,
        private cd: ChangeDetectorRef,
        private meta: Meta,
        public title: Title,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: any,
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
        if (typeof window !== 'undefined' && (<any>window).isSafari) {
            this.elementRef.nativeElement.style.webkitTransform = 'translate3d(0,0,0)';
        }

        this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];

        this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
            
            if (queryParams['info']) {
                this.sidepanelState = queryParams['info'];
                this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
                if (this.isMobile && this.sidepanelState === 'full') {
                    setTimeout(() => this.elementRef.nativeElement.scrollTop = window.innerHeight - 45);
                }
                if (this.selectedEvent) {
                    setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
                }
            }
            if (this.sidepanelState === 'short') {
                this.app.removeHeader = false;
                this.app.showHeader = true;
                this.showTitleHeaderMobile = false;
            }

            setTimeout(() => this.updateSiteMetaAndTitle());
            this.adjustTimelineForEdge();
        });

        this.dataSubscription = this.route.data.subscribe(data => {
            this.events = data.events;
            this.generateTimeFilterIds();
            this.selectedEvent = data.selectedEvent;
            if (this.selectedEvent) {
                this.previousEvent = this.selectedEvent.previousEvent;
                this.nextEvent = this.selectedEvent.nextEvent;
                this.information = this.selectedEvent.information;
                setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates, 14));
            } else {
                if (this.isMobile) {
                    setTimeout(() => this.map.flyTo(<any>[16.372472, 48.208417], 11));
                } else {
                    setTimeout(() => this.map.flyTo(<any>[16.372472, 48.208417], 12.14));
                }
                this.sidepanelState = 'short';
                this.page = data.pages.find(p => p.titleEn === 'Topography');
            }
            
            this.updateSiteMetaAndTitle();
            this.cd.detectChanges();
        });
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
                        queryParams: { 'lang': this.translate.currentLang, 'info': this.sidepanelState },
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

    private updateSiteMetaAndTitle() {
        let title;
        let keywords;
        let description;
        let canonicalUrl = "https://campusmedius.net/topography";
        let alternateUrl;
        if (this.selectedEvent) {
            title = 'Campusmedius - ' + (this.translate.currentLang === 'de' ? this.selectedEvent.titleDe : this.selectedEvent.titleEn);
            keywords = (this.translate.currentLang === 'de' ? this.selectedEvent.keywordsDe : this.selectedEvent.keywordsEn);
            description = (this.translate.currentLang === 'de' ? this.selectedEvent.abstractDe : this.selectedEvent.abstractEn);
            canonicalUrl += "/events/" + this.selectedEvent.id;
            alternateUrl = canonicalUrl + '?info=full' + '&lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
            canonicalUrl += '?info=full' + '&lang=' + this.translate.currentLang;

        } else {
            title = 'Campusmedius - ' + (this.translate.currentLang === 'de' ? this.page.titleDe : this.page.titleEn);
            keywords = (this.translate.currentLang === 'de' ? this.page.keywordsDe : this.page.keywordsEn);
            description = (this.translate.currentLang === 'de' ? this.page.abstractDe : this.page.abstractEn);
            alternateUrl = canonicalUrl + '?lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
            canonicalUrl += '?lang=' + this.translate.currentLang;
        }
        
        this.title.setTitle(title.replace(/<[^>]*>/g, ''));
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
        if(this.selectedEvent) {
            jsonLdScript.text = JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "Article",
                "name":title,
                "headline":title,
                "abstract": description,
                "image": "https://campusmedius.net/assets/screenshot.jpg",
                "datePublished": this.selectedEvent.created.toISOString(),
                "dateModified": this.selectedEvent.updated.toISOString(),
                "keywords": keywords.join(','),
                "url": canonicalUrl,
                "author": {
                    "@context": "https://schema.org/",
                    "@type": "Person",
                    "name": "Simon Ganahl"
                },
                "about": {
                    "@type": "Event",
                    "startDate": this.selectedEvent.start.toISOString(),
                    "endDate": this.selectedEvent.end.toISOString(),
                    "location": {
                        "@context": "https://schema.org",
                        "@type": "Place",
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": this.selectedEvent.coordinates.lat,
                            "longitude": this.selectedEvent.coordinates.lng
                        }
                    }
                }
            }, null, 2);
        } else {
            jsonLdScript.text = "";
        }
    }

    private adjustTimelineForEdge() {
        if (isPlatformBrowser(this.platformId) && (<any>document).isEdge) {
            setTimeout(() => {
                const element = (<any>document.getElementsByTagName('cm-timeline')[0]);
                if (!element) {
                    return;
                }
                if (this.sidepanelState === 'full') {
                    if (element.style.width !== '25%') {
                        setTimeout(() => {
                            element.style.width = '25%';
                        }, 300);
                    }
                } else {
                    if (element.style.width !== '') {
                        element.style.width = '';
                    }
                }
            });
        }
    }

    public scrollUp() {
        this.infoContainer.scrollToReference('top', 650);
    }

    public showCite() {
        const dialogRef = this.dialog.open(CiteDialogComponent, {
            width: '800px',
            maxHeight: '90vh',
            data: {data: this.selectedEvent, type: 'event'},
            autoFocus: false
        });
    }

    public updateTimeFilter(key: string, time: Moment) {
        if (key === 'start') {
            this.timeFilterStart = time;
        }
        if (key === 'end') {
            this.timeFilterEnd = time;
        }

        this.generateTimeFilterIds();
    }

    private generateTimeFilterIds() {
      const ids = [];
      this.events.forEach(event => {
          if (event.end.isAfter(this.timeFilterStart) && event.start.isBefore(this.timeFilterEnd)) {
              ids.push(event.id);
          }
      });

      this.filteredIds = ids;
    }

    public eventSelected(event: Event) {
        this.router.navigate(['/topography', 'events', event.id],
            {
                queryParamsHandling: 'preserve'
            });
    }

    public toggleInformationPanel() {
        if (this.sidepanelState === 'full') {
            this.router.navigate([], { queryParams: { info: 'short' }, queryParamsHandling: 'merge' });
            setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
        } else {
            setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
            this.router.navigate([], { queryParams: { info: 'full' }, queryParamsHandling: 'merge' });
        }
    }

    public mobileShowMore() {
        this.sidepanelState = 'full';
        this.router.navigate([], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge' });
    }

    public mobileShowShort() {
        if (this.sidepanelState !== 'short') {
            this.sidepanelState = 'short';
            this.router.navigate([], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge' });
        }
    }

    public sectionChange(section: string) {
        if (this.sidepanelState === 'full') {
            this.skipFragmentUpdate = true;
            this.router.navigate( [ ], { fragment: section, queryParams: { }, queryParamsHandling: 'merge', replaceUrl: true } );
        }
    }

    @HostListener('scroll')
    private onMobileScroll() {
        if (this.galleryIsOpen) {
            return;
        }

        const scrollTop = this.elementRef.nativeElement.scrollTop;
        const clientHeight = this.elementRef.nativeElement.clientHeight;

        if (scrollTop < 170) {
            this.mobileShowShort();
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
    }

    public galleryOpened() {
        this.galleryIsOpen = true;
        this.app.removeHeader = true;
    }

    ngOnDestroy() { 
        this.dataSubscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
        this.mediaSubscription.unsubscribe();
    }

}
