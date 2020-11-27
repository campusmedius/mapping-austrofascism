import {
    Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

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

const SIDEPANEL_WIDTH = {
    full: '75%',
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
        trigger('timeline', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.full + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH.short + ')' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('titleHeader', [
            state('0', style({ opacity: 0 })),
            state('1', style({ opacity: 1 })),
            transition('0 <=> 1', animate('300ms ease-in'))
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

    @ViewChild(MapComponent, {static: false}) map: MapComponent;
    @ViewChild('fullinfo', {static: false}) fullinfo: ElementRef;

    public showTitleHeader = false;
    public showTitleHeaderMobile = false;
    private galleryIsOpen = false;
    private scrollTopBeforeGalleryOpen = 0;

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
        private scrollToService: ScrollToService,
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
                setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates, 15));

                let target = (<any>this.route.fragment).getValue();
                let offset = -100;
                if (!target || target === 'p:1') {
                    target = '#info-top';
                    offset = 0;
                }
                setTimeout(() => {
                this.scrollToService.scrollTo({
                    target: target,
                    offset: offset,
                    duration: 0
                })}, 100);

            } else {
                setTimeout(() => this.map.flyTo(<any>[16.4, 48.2], 12.14));
                this.sidepanelState = 'short';
                this.page = data.pages.find(p => p.titleEn === 'Topography');
            }
            this.cd.detectChanges();
        });

        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: { 'lang': this.translate.currentLang, 'info': this.sidepanelState },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });

    }

    ngAfterViewInit() {
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

    public scrollup() {
        this.scrollToService.scrollTo({
            target: '#info-top',
            offset: -150
        });
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
            this.sidepanelState = 'short';
            this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
            setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
        } else {
            this.sidepanelState = 'full';
            this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
            setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
        }
        this.router.navigate([], { queryParams: { info: this.sidepanelState }, queryParamsHandling: 'merge' });
    }

    public readMore() {
      this.router.navigate(['/topography/events/1'], { queryParamsHandling: 'merge' });
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

    private onScroll() {
        if (this.fullinfo.nativeElement.scrollTop < 110) {
            this.showTitleHeader = false;
        } else {
            this.showTitleHeader = true;
        }
    }

    public sectionChange(section: string) {
        if (this.sidepanelState === 'full') {
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
