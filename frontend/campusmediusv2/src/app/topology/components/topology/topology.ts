import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
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
import { MatDialog, MatDialogRef } from '@angular/material';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { AppComponent } from '@app/core';
import { InfoContainerComponent } from '@app/information/components/info-container/info-container';

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
    public mobileOverlayHeight = '200px';

    public atGod = false;

    private timer;

    sidepanelState = 'short'; // full, short
    sidepanelStateForLinksInGodSelector = 'short'
    mediationState = 'open'; // open, closed
    isMobile = false;
    public mapAttribIsOpen = false;

    @ViewChild(MapComponent) map: MapComponent;
    @ViewChild(InfoBoxComponent) infoBox: InfoBoxComponent;
    @ViewChild(InfoContainerComponent) infoContainer: InfoContainerComponent;
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
            }
            if (this.sidepanelState === 'short') {
                this.app.removeHeader = false;
                this.app.showHeader = true;
                this.showTitleHeaderMobile = false;
            }
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
        });


    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            if (!this.skipFragmentUpdate) {
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
            } else {
                this.skipFragmentUpdate = false;
            }
        });

        this.adjustMap();
    }

    resetAnimations() {
        clearTimeout(this.timer);
        if(this.infoBox) {
            this.infoBox.stopAnimation();
        }
        if(this.map) {
            this.map.stopAnimation();
        }
    }

    private adjustTimelineForEdge() {
        if ((<any>document).isEdge) {
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

        this.map.setPerspective(this.selectedMediation);

        if (this.previousMediator && this.previousMediator !== this.selectedMediator) {
            let foundRelation = false;
            this.previousMediator.relationsTo.forEach(r => {
                if (r.targetId === this.selectedMediator.id) {
                    foundRelation = true;
                    this.infoBox.navigateToMediator(this.selectedMediator, r, 'forward');
                    this.map.doNavigation(this.selectedMediation, r.source, this.selectedMediator);
                }
            });
            if (!foundRelation && this.selectedMediation.id === '2') {
                // check for backward relation in examining gaze
                this.selectedMediator.relationsTo.forEach(r => {
                    if (r.sourceId === this.selectedMediator.id) {
                        this.infoBox.navigateToMediator(this.selectedMediator, r, 'backward');
                        this.map.doNavigation(this.selectedMediation, r.source, this.selectedMediator);
                    }
                });
            }
        } else {
            this.map.showMediator(this.selectedMediation, this.selectedMediator);
            this.infoBox.setSpaceTime(this.selectedMediator, 0, 0);
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
            data: { event: this.selectedMediator },
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

    ngOnDestroy() {
        this.dataSubscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
        this.mediaSubscription.unsubscribe();
    }
}
