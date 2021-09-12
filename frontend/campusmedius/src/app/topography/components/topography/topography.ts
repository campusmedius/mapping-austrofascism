import {
    Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef, AfterViewInit, PLATFORM_ID, Inject, Optional
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
import { REQUEST } from '@nguniversal/express-engine/tokens';

const SIDEPANEL_WIDTH = {
    full: '70%',
    short: '470px',
};


@Component({
    selector: 'cm-topography',
    templateUrl: './topography.html',
    styleUrls: ['./topography.scss'],
    host: {'class': 'scroll-container'},
    animations: [
        trigger('sidenav', [
            state('full', style({ width: SIDEPANEL_WIDTH.full })),
            state('short', style({ width: SIDEPANEL_WIDTH.short })),
            transition('* <=> *', animate('200ms ease-in'))
        ]),
        trigger('infoEventNav', [
            state('full', style({ right: '60px' })),
            state('short', style({ right: '0px' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('timeline', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.full + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.short + ')' })),
            transition('* <=> *', animate('200ms ease-in'))
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
    public isFirst = true;
    public nextEvent: Event;
    public previousEvent: Event;
    public information: Information;
    public page: Page;

    dataSubscription: Subscription;
    queryParamsSubscription: Subscription;
    mediaSubscription: Subscription;

    filteredIdsSubscription: Subscription;
    selectedEventsSubscription: Subscription;
    isMobile = true;
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
        @Optional() @Inject(REQUEST) protected request: Request,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.mediaSubscription = this.mediaObserver.media$.subscribe((change: MediaChange) => {
                if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
                    this.isMobile = true;
                } else {
                    this.isMobile = false;
                }
            });
        } else {
            const agent = this.request.headers['user-agent'];
            let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(agent);
            this.isMobile = check;
        }
    }

    
    ngOnInit() {
        if (typeof window !== 'undefined' && (<any>window).isSafari) {
            this.elementRef.nativeElement.style.webkitTransform = 'translate3d(0,0,0)';
        }

        if (this.route.snapshot.queryParams.info === 'full') {
            this.sidepanelState = 'full';
        }
        this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];

        this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
            
            if (queryParams['info']) {
                this.sidepanelState = queryParams['info'];
                this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
                if (this.isMobile && this.sidepanelState === 'full') {
                    setTimeout(() => this.infoContainerMobile.scrollToReference('top'));
                }
                if (this.selectedEvent) {
                    if(!this.isFirst) {
                        setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
                    } else {
                        setTimeout(() => this.map.jumpTo(this.selectedEvent.coordinates));
                    }
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
                setTimeout(() => {
                    let fragment = this.route.snapshot.fragment;
                    fragment = fragment ? fragment : 'top';
                    let infoContainer = this.isMobile ? this.infoContainerMobile : this.infoContainer;
                    if(infoContainer) {
                        infoContainer.scrollToReference(fragment);
                    }
                    if(this.map) {
                        if(!this.isFirst) {
                            this.map.flyTo(this.selectedEvent.coordinates, 14);
                        } else {
                            this.map.jumpTo(this.selectedEvent.coordinates, 14);
                        }
                        this.isFirst = false;
                    }

                    // set lang in url if not set
                    if(!this.route.snapshot.queryParams.lang || !this.route.snapshot.queryParams.info) {
                        this.router.navigate(['.'], {
                            relativeTo: this.route,
                            queryParams: { 'lang': this.translate.currentLang, 'info': this.sidepanelState },
                            queryParamsHandling: 'merge',
                            fragment: fragment,
                            replaceUrl: true
                        });
                    }
                });
            } else {
                this.isFirst = false;
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
                        infoContainer.scrollToReference(fragment, 100);
                    }
                }, 0);
            } else {
                this.skipFragmentUpdate = false;
            }
        });
    }

    private updateSiteMetaAndTitle() {
        let name;
        let keywords;
        let description;
        let canonicalUrl = "https://campusmedius.net/topography";
        let alternateUrl;
        if (this.selectedEvent) {
            name = (this.translate.currentLang === 'de' ? this.selectedEvent.titleDe : this.selectedEvent.titleEn);
            keywords = (this.translate.currentLang === 'de' ? this.selectedEvent.keywordsDe : this.selectedEvent.keywordsEn);
            description = (this.translate.currentLang === 'de' ? this.selectedEvent.abstractDe : this.selectedEvent.abstractEn);
            canonicalUrl += "/events/" + this.selectedEvent.id;
            alternateUrl = canonicalUrl + '?info=full' + '&lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
            canonicalUrl += '?info=full' + '&lang=' + this.translate.currentLang;

        } else {
            name = (this.translate.currentLang === 'de' ? this.page.titleDe : this.page.titleEn);
            keywords = (this.translate.currentLang === 'de' ? this.page.keywordsDe : this.page.keywordsEn);
            description = (this.translate.currentLang === 'de' ? this.page.abstractDe : this.page.abstractEn);
            alternateUrl = canonicalUrl + '?lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
            canonicalUrl += '?lang=' + this.translate.currentLang;
        }
        keywords = keywords.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        const screenshotUrl = this.translate.currentLang === 'de' ? "https://campusmedius.net/assets/screenshot_de.png" : "https://campusmedius.net/assets/screenshot_en.png"     
        const copyrightNotice = this.translate.currentLang === 'de' ? "Diese Website ist lizenziert unter Creative Commons Namensnennung 4.0 (CC BY 4.0). Diese Lizenz erlaubt die uneingeschränkte Nutzung und Verbreitung des entsprechenden Materials unter der Bedingung, dass die UrheberInnen, bei denen alle Rechte verbleiben, und die Quelle eindeutig genannt werden. Die Wiederverwendung von auf dieser Website zitierten Werken aus externen Quellen (Texte, Bilder, Ton- und Filmaufnahmen) erfordert ggf. weitere Nutzungsgenehmigungen durch die jeweiligen RechteinhaberInnen. Die Verpflichtung, solche Genehmigungen einzuholen, liegt bei der wiederverwendenden Partei." : "This website is licensed under Creative Commons Attribution 4.0 (CC BY 4.0). This license permits unrestricted use and distribution of the respective material, provided that the creator(s), who retain(s) copyright, and the source are properly credited. The reuse of works cited on this website from external sources (texts, images, audio, video) may require further permissions from the rights holder(s). The obligation to research and obtain such permissions lies with the reusing party.";
        let funder;
        if (this.translate.currentLang === 'de') {
            funder = [{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Österreichische Akademie der Wissenschaften (ÖAW)",
                "url": "https://www.oeaw.ac.at/"
            },{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Österreichischer Wissenschaftsfonds (FWF)",
                "url": "https://fwf.ac.at/"
            },{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Universität Wien",
                "url": "https://www.univie.ac.at/"
            },{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Stadt Wien",
                "url": "https://www.wien.gv.at/kultur/abteilung/"
            }]
        } else {
            funder = [{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Austrian Academy of Sciences (ÖAW)",
                "url": "https://www.oeaw.ac.at/en/austrian-academy-of-sciences"
            },{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Austrian Science Fund (FWF)",
                "url": "https://fwf.ac.at/en/"
            },{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "University of Vienna",
                "url": "https://www.univie.ac.at/en/"
            },{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "City of Vienna",
                "url": "https://www.wien.gv.at/kultur/abteilung/"
            }]
        }
        name = name.replace(/<[^>]*>/g, '').replace(/"/g, '');
        let title = name + ' in Campus Medius';
        description = description.replace(/<[^>]*>/g, '');
        
        this.title.setTitle(name);
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
        this.meta.updateTag({name: 'og:image', content: screenshotUrl});
        this.meta.updateTag({name: 'og:site_name', content: "Campus Medius"});
        this.meta.updateTag({name: 'twitter:card', content: "summary"});

        let jsonLdScript = <HTMLScriptElement>this.document.getElementById('jsonld');
        if(this.selectedEvent) {
            if(this.translate.currentLang === 'en') {
                jsonLdScript.text = JSON.stringify({
                    "@context": "https://schema.org/",
                    "@type": "ScholarlyArticle",
                    "name":title,
                    "headline":name,
                    "abstract": description,
                    "inLanguage": this.translate.currentLang,
                    "image": screenshotUrl,
                    "datePublished": this.selectedEvent.created.toISOString(),
                    "dateModified": this.selectedEvent.updated.toISOString(),
                    "keywords": keywords.join(','),
                    "url": canonicalUrl,
                    "author": {
                        "@context": "https://schema.org/",
                        "@type": "Person",
                        "name": "Simon Ganahl"
                    },
                    "translator": {
                        "@context": "https://schema.org/",
                        "@type": "Person",
                        "name": "Katy Derbyshire"
                    },
                    "funder": funder,
                    "copyrightNotice": copyrightNotice,
                    "about": {
                        "@type": "Event",
                        "name": name,
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
                    },
                    "isPartOf": {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "url": "https://campusmedius.net",
                        "author": [{
                            "@context": "https://schema.org/",
                            "@type": "Person",
                            "name": "Simon Ganahl"
                        },{
                            "@context": "https://schema.org/",
                            "@type": "Person",
                            "name": "Susanne Kiesenhofer"
                        },{
                            "@context": "https://schema.org/",
                            "@type": "Person",
                            "name": "Andreas Krimbacher"
                        }]
                    }
                }, null, 2);
            } else {
                jsonLdScript.text = JSON.stringify({
                    "@context": "https://schema.org/",
                    "@type": "ScholarlyArticle",
                    "name":title,
                    "headline":name,
                    "abstract": description,
                    "inLanguage": this.translate.currentLang,
                    "image": screenshotUrl,
                    "datePublished": this.selectedEvent.created.toISOString(),
                    "dateModified": this.selectedEvent.updated.toISOString(),
                    "keywords": keywords.join(','),
                    "url": canonicalUrl,
                    "author": {
                        "@context": "https://schema.org/",
                        "@type": "Person",
                        "name": "Simon Ganahl"
                    },
                    "funder": funder,
                    "about": {
                        "@type": "Event",
                        "name": name,
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
                    },
                    "copyrightNotice": copyrightNotice,
                    "isPartOf": {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "url": "https://campusmedius.net",
                        "author": [{
                            "@context": "https://schema.org/",
                            "@type": "Person",
                            "name": "Simon Ganahl"
                        },{
                            "@context": "https://schema.org/",
                            "@type": "Person",
                            "name": "Susanne Kiesenhofer"
                        },{
                            "@context": "https://schema.org/",
                            "@type": "Person",
                            "name": "Andreas Krimbacher"
                        }]
                    }
                }, null, 2);
            }
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
        this.router.navigate([], {
            queryParamsHandling: 'merge',
            fragment: 'top'
        });
    }

    public showCite() {
        const dialogRef = this.dialog.open(CiteDialogComponent, {
            width: '800px',
            maxHeight: '90vh',
            data: {data: this.selectedEvent, type: 'event', isMobile: this.isMobile},
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
        (window as any).skipSectionChange += 1;
        this.router.navigate(['/topography', 'events', event.id],
            {
                queryParamsHandling: 'preserve',
                fragment: 'p:1'
            });
        setTimeout(() => {
            (window as any).skipSectionChange -= 1;
            }, 200);
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
        (window as any).skipSectionChange += 1;
        this.router.navigate([], { queryParams: { info: 'full' }, queryParamsHandling: 'merge' });
        setTimeout(() => {
            (window as any).skipSectionChange -= 1;
          }, 2000);
    }

    public mobileShowShort() {
        if (this.sidepanelState !== 'short') {
            this.sidepanelState = 'short';
            this.router.navigate([], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge' });
        }
    }

    public sectionChange(section: string) {
        if (this.sidepanelState === 'full' && section !== this.route.snapshot.fragment) {
            this.skipFragmentUpdate = true;
            this.router.navigate( [ ], { fragment: section, queryParams: { }, queryParamsHandling: 'merge', replaceUrl: true } );
        }
    }

    @HostListener('scroll')
    private onMobileScroll() {
        if (this.galleryIsOpen || (window as any).skipSectionChange) {
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
        if (isPlatformBrowser(this.platformId)) {
            this.mediaSubscription.unsubscribe();
        }
    }
}
