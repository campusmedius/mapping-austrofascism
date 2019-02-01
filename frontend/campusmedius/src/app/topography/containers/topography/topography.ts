import {
    Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, transition, animate, style, query, state } from '@angular/animations';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from '../../../core/containers/app/app';
import { MapComponent } from '../../components/map/map';
import { CiteDialogComponent } from '../../components/cite-dialog/cite-dialog.component';

import { Store } from '@ngrx/store';
import * as fromTopography from '../../reducers';
import * as event from '../../actions/event';

import { Information } from '../../../information/models/information';

import { Event } from '../../models/event';

import { Moment } from 'moment';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

const SIDEPANEL_WIDTH = {
    'full': '75%',
    'short': '470px',
};


@Component({
    selector: 'cm-topography',
    templateUrl: './topography.html',
    styleUrls: ['./topography.scss'],
    animations: [
        trigger('sidenavIcon', [
            state('full', style({ transform: 'scaleX(1)' })),
            state('short', style({ transform: 'scaleX(-1)' })),
            transition('full <=> short', animate('300ms ease-in'))
        ]),
        trigger('sidenav', [
            state('full', style({ width: SIDEPANEL_WIDTH['full'] })),
            state('short', style({ width: SIDEPANEL_WIDTH['short'] })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('timeline', [
            state('full', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH['full'] + ')' })),
            state('short', style({ width: 'calc(100vw - ' + SIDEPANEL_WIDTH['short'] + ')' })),
            transition('* <=> *', animate('300ms ease-in'))
        ]),
        trigger('titleHeader', [
            state('0', style({ opacity: 0 })),
            state('1', style({ opacity: 1 })),
            transition('0 <=> 1', animate('300ms ease-in'))
        ])
    ]
})
export class TopographyComponent implements OnInit, OnDestroy {
    events$: Observable<Event[]>;
    information$: Observable<Information>;
    filteredIdsSubscription: Subscription;
    selectedEventsSubscription: Subscription;
    mediaSubscription: Subscription;
    isMobile: boolean;
    filteredIds: string[] = [];
    selectedEvent: Event;
    nextEvent: Event;
    previousEvent: Event;
    sidepanelState = 'short'; // full, short
    sidepanelWidth: string;

    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild('infoheading') infoheading: ElementRef;
    @ViewChild('fullinfo') fullinfo: ElementRef;

    public showTitleHeader = false;
    public showTitleHeaderMobile = false;
    private galleryIsOpen = false;

    public timelineHeight = '40px';
    public mobileOverlayHeight = '200px';
    public mobileOverlayAboutHeight = '300px';
    public mobileOverlayDefaultHeight = '200px';

    private isPage = false;
    public mobileAbstractDe = '<p><i>Campus Medius</i> erforscht und erweitert die Möglichkeiten digitalen Mappings in den Kultur- und Medienwissenschaften.</p>';
    public mobileAbstractEn = '<p><i>Campus Medius</i> explores and expands the possibilities of digital mapping in cultural and media studies.</p>';

    constructor(
        private store: Store<fromTopography.State>,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private media: ObservableMedia,
        private scrollToService: ScrollToService,
        private elementRef: ElementRef,
        private app: AppComponent
    ) {
        this.mediaSubscription = media.subscribe((change: MediaChange) => {
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
        this.route.fragment.subscribe((fragment: string) => {
            if (fragment) {
                setTimeout(() => {
                    this.scrollToService.scrollTo({
                        target: fragment,
                        offset: -70
                    });
                }, 300);
            }
        });
        this.route.queryParams.subscribe(queryParams => {
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

        this.events$ = this.store.select(fromTopography.getAllEvents);
        this.filteredIdsSubscription = this.store.select(fromTopography.getFilteredEventIds)
            .subscribe((ids: string[]) => this.filteredIds = ids);

        this.selectedEventsSubscription = this.store.select(fromTopography.getSelectedEvent)
            .subscribe((e) => {
                this.selectedEvent = <any>e.current;
                this.nextEvent = e.next;
                this.previousEvent = e.previous;
                if (e.current) {
                    if (e.current.id === 'about' || e.current.id === 'team') {
                        this.isPage = true;
                        if (e.current.id === 'team') {
                            this.sidepanelState = 'full';
                        }
                        if (e.current.id === 'about') {
                            this.mobileOverlayHeight = this.mobileOverlayAboutHeight;
                        }
                    } else {
                        this.isPage = false;
                        this.mobileOverlayHeight = this.mobileOverlayDefaultHeight;
                    }

                    this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
                    if (!this.isMobile) {
                        this.scrollToService.scrollTo({
                            target: this.infoheading,
                            offset: -150
                        });
                    }
                    if (this.isMobile && this.sidepanelState === 'full') {
                        setTimeout(() => this.elementRef.nativeElement.scrollTop = this.map.mapElement.nativeElement.clientHeight);
                    }
                    setTimeout(() => this.map.flyTo(e.current.coordinates));
                } else {
                    this.sidepanelState = 'short';
                    this.sidepanelWidth = SIDEPANEL_WIDTH['short'];
                }

                if (this.sidepanelState === 'short') {
                    this.app.removeHeader = false;
                    this.app.showHeader = true;
                    this.showTitleHeaderMobile = false;
                }

                this.adjustTimelineForEdge();
            });

        this.information$ = this.store.select(fromTopography.getSelectedInformation);

        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: { 'lang': this.translate.currentLang },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    private adjustTimelineForEdge() {
        const element = (<any>document.getElementsByTagName('cm-timeline')[0]);
        if (!element) {
            return;
        }
        if (this.sidepanelState === 'full') {
            if ((<any>document).isEdge) {
                if (element.style.width === '25%') {
                    setTimeout(() => {
                        element.style.width = '25%';
                    }, 300);
                }
            }
        } else {
            if ((<any>document).isEdge) {
                if (element.style.width === '') {
                    setTimeout(() => {
                        element.style.width = '';
                    });
                }
            }
        }
    }

    public scrollup() {
        this.scrollToService.scrollTo({
            target: this.infoheading,
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
        let start = null;
        let end = null;

        if (key === 'start') {
            start = time;
        }
        if (key === 'end') {
            end = time;
        }

        this.store.dispatch(new event.SetTimeFilter({ start: start, end: end }));
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
            if (this.selectedEvent.id === 'team') {
                this.router.navigate(['/about'], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
            } else {
                this.router.navigate([], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
            }
        } else {
            this.sidepanelState = 'full';
            this.sidepanelWidth = SIDEPANEL_WIDTH[this.sidepanelState];
            this.router.navigate([], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
            setTimeout(() => this.map.flyTo(this.selectedEvent.coordinates));
        }
    }

    public mobileShowMore() {
        this.sidepanelState = 'full';
        this.router.navigate([], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
        setTimeout(() => {
            this.elementRef.nativeElement.scrollTop = this.map.mapElement.nativeElement.clientHeight;
        });
    }

    public mobileShowShort() {
        if (this.sidepanelState !== 'short') {
            this.sidepanelState = 'short';
            if (this.selectedEvent.id === 'team') {
                this.router.navigate(['/about'], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
            } else {
                this.router.navigate([], { queryParams: { 'info': this.sidepanelState }, queryParamsHandling: 'merge' });
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
    }

    public galleryOpened() {
        this.galleryIsOpen = true;
        this.app.removeHeader = true;
    }

    ngOnDestroy() {
        this.filteredIdsSubscription.unsubscribe();
        this.selectedEventsSubscription.unsubscribe();
        this.mediaSubscription.unsubscribe();
    }

}
