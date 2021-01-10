import {
    Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { MatDialog } from '@angular/material';
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

    public showTitleHeader = false;
    public showTitleHeaderMobile = false;
    private galleryIsOpen = false;
    private scrollTopBeforeGalleryOpen = 0;
    private skipFragmentUpdate = false;

    public timelineHeight = '40px';
    public mobileOverlayHeight = '200px';
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
        private cd: ChangeDetectorRef
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
        if ((<any>window).isSafari) {
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
                if (this.selectedEvent) {
                    setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
                }
            }
            if (this.sidepanelState === 'short') {
                this.app.removeHeader = false;
                this.app.showHeader = true;
                this.showTitleHeaderMobile = false;
            }
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
                setTimeout(() => this.map.flyTo(<any>[16.372472, 48.208417], 12.14));
                this.sidepanelState = 'short';
                this.page = data.pages.find(p => p.titleEn === 'Topography');
            }
            this.cd.detectChanges();
        });
    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            if (!this.skipFragmentUpdate) {
                setTimeout(() => {
                    fragment = fragment ? fragment : 'top';
                    if (this.infoContainer) {
                        this.infoContainer.scrollToReference(fragment);
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

    private adjustTimelineForEdge() {
        if ((<any>document).isEdge) {
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
            data: { event: this.selectedEvent },
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
        setTimeout(() => {
            this.elementRef.nativeElement.scrollTop = this.map.mapElement.nativeElement.clientHeight;
        });
    }

    public mobileShowShort() {
        if (this.sidepanelState !== 'short') {
            this.sidepanelState = 'short';
            if (this.selectedEvent.id === 'team') {
                this.router.navigate(['/about'], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge' });
            } else {
                this.router.navigate([], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge' });
            }
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

        if (this.elementRef.nativeElement.scrollTop < 170) {
            this.mobileShowShort();
        }
        if (this.elementRef.nativeElement.scrollTop < (this.map.mapElement.nativeElement.clientHeight + 150)) {
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
