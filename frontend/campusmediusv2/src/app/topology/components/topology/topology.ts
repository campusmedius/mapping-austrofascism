import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Mediator } from '@app/topology/models/mediator';
import { Mediation } from '@app/topology/models/mediation';
import { Information } from '@app/information/models/information';
import { Page } from '@app/information/models/page';
import { TranslateService } from '@ngx-translate/core';
import { MapComponent } from '../map/map';
import { InfoBoxComponent } from '../info-box/info-box';
import { MatDialog } from '@angular/material/dialog';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AppComponent } from '@app/core';
import { InfoContainerComponent } from '@app/information/components/info-container/info-container';
import { InfoBoxMobileComponent } from '../info-box-mobile/info-box-mobile';
import { InfoContainerMobileComponent } from '@app/information/components/info-container-mobile/info-container-mobile';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

const SIDEPANEL_WIDTH = {
    full: '70%',
    short: '470px',
};

@Component({
    selector: 'cm-topology',
    templateUrl: './topology.html',
    styleUrls: ['./topology.scss'],
    animations: [
        trigger('sidenav', [
            state('full', style({ width: SIDEPANEL_WIDTH.full })),
            state('short', style({ width: SIDEPANEL_WIDTH.short })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('mediationsPanel', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.full + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.short + ')' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('infoBox', [
            state('open', style({ bottom: '240px' })),
            state('closed', style({ bottom: '60px' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('mapTopOffset', [
            state('open', style({ top: 'calc(-260px + 3.3rem)' })),
            state('closed', style({ top: 'calc(-170px + 3.3rem)' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('mapLeftOffset', [
            state('full', style({ left: 'calc(-35% - 150px)' })),
            state('short', style({ left: '-385px' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('titleHeader', [
            state('false', style({ opacity: 0 })),
            state('true', style({ opacity: 1 })),
            transition('false <=> true', animate('300ms ease-in'))
        ]),
        trigger('mapattribOpen', [
            state('true', style({ 'width': '*', display: '*' })),
            state('false', style({ 'width': '0px', display: 'none' })),
            transition('false => true', [
                style({ 'display': 'block' }),
                animate('300ms ease-in')
            ]),
            transition('true => false', [
                animate('300ms ease-in')
            ])
        ])
    ]
})
export class TopologyComponent implements OnInit, AfterViewInit, OnDestroy {
    public mediations: Mediation[];
    public isStartPage = true;
    public selectedMediation: Mediation;
    public focusedMediation: Mediation;
    public previousMediation: Mediation;
    public mediators: Mediator[];
    public visibleMediators: Mediator[];
    public selectedMediator: Mediator;
    public focusedMediator: Mediator;
    public previousMediator: Mediator = null;
    public information: Information;
    public page: Page;

    dataSubscription: Subscription;
    queryParamsSubscription: Subscription;
    mediaSubscription: Subscription;

    public showTitleHeader = false;
    public showTitleHeaderMobile = false;
    private galleryIsOpen = false;
    private scrollTopBeforeGalleryOpen = 0;
    private skipFragmentUpdate = false;

    public sidepanelWidth: string;
    public mediationsHeight = '220px';
    public mobileOverlayHeight = '170px';

    public atGod = false;

    private timer;

    sidepanelState = 'short'; // full, short
    sidepanelStateForLinksInGodSelector = 'short'
    mediationState = 'open'; // open, closed
    isMobile = false;
    public mapAttribIsOpen = false;

    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild(InfoBoxComponent) infoBox: InfoBoxComponent;
    @ViewChild(InfoBoxMobileComponent) infoBoxMobile: InfoBoxMobileComponent;
    @ViewChild(InfoContainerComponent) infoContainer: InfoContainerComponent;
    @ViewChild(InfoContainerMobileComponent) infoContainerMobile: InfoContainerMobileComponent;
    @ViewChild('mapattrib', {static: true}) mapAttrib: ElementRef;

    @HostListener('document:click', ['$event'])
    clickout(event) {
      if(!this.mapAttrib.nativeElement.contains(event.target)) {
        this.mapAttribIsOpen = false;
      }
    }

    constructor(
      private translate: TranslateService,
      private elementRef: ElementRef,
      private route: ActivatedRoute,
      private mediaObserver: MediaObserver,
      private dialog: MatDialog,
      private router: Router,
      private app: AppComponent,
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
                    setTimeout(() => this.elementRef.nativeElement.scrollTop = this.map.mapElement.nativeElement.clientHeight);
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
            this.resetAnimations();

            this.mediations = data.mediations;
            this.selectedMediation = data.selectedMediation;
            this.mediators = data.mediators;
            this.visibleMediators = [];
            this.selectedMediator = data.selectedMediator ? data.selectedMediator : null;

            if (this.selectedMediation !== this.previousMediation) {
                this.previousMediator = null;
            }

            if (this.selectedMediator) {
                this.isStartPage = false;
                if (this.selectedMediator.id === '0') {
                    this.sidepanelStateForLinksInGodSelector = this.sidepanelState;
                    this.sidepanelState = 'short';
                    this.router.navigate([], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge', replaceUrl: true });
                    if (this.previousMediator) {
                        this.timer = setTimeout(() => {
                            this.atGod = true;
                        }, 4000);
                    } else {
                        this.atGod = true;
                    }
                } else {
                    this.atGod = false;
                    this.visibleMediators = [ this.selectedMediator ];
                }

                this.information = this.selectedMediator.information;
            } else {
                this.isStartPage = true;
                this.sidepanelState = 'short';
                this.page = data.pages.find(p => p.titleEn === 'Topology');
            }

            if (this.map) {
                this.adjustMap();
            }

            this.previousMediator = this.selectedMediator;
            this.previousMediation = this.selectedMediation;

            this.updateSiteMetaAndTitle();
        });


    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            if (!this.skipFragmentUpdate) {
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
            } else {
                this.skipFragmentUpdate = false;
            }
        });

        this.adjustMap();
    }

    private updateSiteMetaAndTitle() {
        let title;
        let keywords;
        let description;
        let canonicalUrl = "https://campusmedius.net/topology";
        let alternateUrl;
        if (this.selectedMediator) {
            title = 'Campusmedius - ' + (this.translate.currentLang === 'de' ? this.selectedMediator.titleDe : this.selectedMediator.titleEn);
            keywords = (this.translate.currentLang === 'de' ? this.selectedMediator.keywordsDe : this.selectedMediator.keywordsEn);
            description = (this.translate.currentLang === 'de' ? this.selectedMediator.abstractDe : this.selectedMediator.abstractEn);
            canonicalUrl += "/mediations/" + this.selectedMediation.id  + "/mediators/" + this.selectedMediator.id;
            alternateUrl = canonicalUrl + '?info=full' + '&lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
            canonicalUrl += '?info=full' + '&lang=' + this.translate.currentLang;

        } else {
            title = 'Campusmedius - ' + (this.translate.currentLang === 'de' ? this.page.titleDe : this.page.titleEn);
            keywords = (this.translate.currentLang === 'de' ? this.page.keywordsDe : this.page.keywordsEn);
            description = (this.translate.currentLang === 'de' ? this.page.abstractDe : this.page.abstractEn);
            alternateUrl = canonicalUrl + '?lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
            canonicalUrl += '?lang=' + this.translate.currentLang;
        }
        
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

    resetAnimations() {
        clearTimeout(this.timer);
        
        let infoBox: any = this.infoBox;
        if (this.isMobile) {
            infoBox = this.infoBoxMobile;
        }
        if(infoBox) {
            infoBox.stopAnimation();
        }
        if(this.map) {
            this.map.stopAnimation();
        }
    }

    private adjustTimelineForEdge() {
        if (isPlatformBrowser(this.platformId) && (<any>document).isEdge) {
            setTimeout(() => {
                const element = (<any>document.getElementsByTagName('cm-mediations')[0]);
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

    adjustMap() {
        if (!this.selectedMediator) {
            return;
        }

        let infoBox: any = this.infoBox;
        if (this.isMobile) {
            infoBox = this.infoBoxMobile;
        }

        this.map.setPerspective(this.selectedMediation);

        if (this.previousMediator && this.previousMediator !== this.selectedMediator) {
            let foundRelation = false;
            this.previousMediator.relationsTo.forEach(r => {
                if (r.targetId === this.selectedMediator.id) {
                    foundRelation = true;
                    infoBox.navigateToMediator(this.selectedMediator, r, 'forward');
                    this.map.doNavigation(this.selectedMediation, r.source, this.selectedMediator);
                }
            });
            if (!foundRelation && this.selectedMediation.id === '2') {
                // check for backward relation in examining gaze
                this.selectedMediator.relationsTo.forEach(r => {
                    if (r.sourceId === this.selectedMediator.id) {
                        infoBox.navigateToMediator(this.selectedMediator, r, 'backward');
                        this.map.doNavigation(this.selectedMediation, r.source, this.selectedMediator);
                    }
                });
            }
        } else {
            this.map.showMediator(this.selectedMediation, this.selectedMediator);
            infoBox.setSpaceTime(this.selectedMediator, 0, 0);
        }
    }


    public toggleInformationPanel() {
        if (this.sidepanelState === 'full') {
            this.router.navigate([], { queryParams: { info: 'short' }, queryParamsHandling: 'merge' });
        } else {
            this.router.navigate([], { queryParams: { info: 'full' }, queryParamsHandling: 'merge' });
        }
    }

    public showCite() {
        const dialogRef = this.dialog.open(CiteDialogComponent, {
            width: '800px',
            maxHeight: '90vh',
            data: {data: this.selectedMediator, type: 'mediator', mediationId: this.selectedMediation.id},
            autoFocus: false
        });
    }

    public scrollUp() {
        this.infoContainer.scrollToReference('top', 650);
    }

    public sectionChange(section: string) {
        if (this.sidepanelState === 'full') {
            this.skipFragmentUpdate = true;
            this.router.navigate( [ ], { fragment: section, queryParams: { }, queryParamsHandling: 'merge', replaceUrl: true } );
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
