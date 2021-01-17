import { Component, OnInit, Input, AfterViewInit, ViewChild, HostListener, ElementRef } from '@angular/core';
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
export class PageComponent implements OnInit, AfterViewInit {
    @Input() pageTitleEn: string;

    mediaSubscription: Subscription;

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
            this.page = data.pages.find(p => p.titleEn === this.pageTitleEn);
            this.overviewPage = data.pages.find(p => p.titleEn === 'Overview');
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
}
