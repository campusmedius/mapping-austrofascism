import { Component, OnInit, Input, AfterViewInit, ViewChild, HostListener, ElementRef, OnDestroy, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@app/information/models/page';
import { MatDialog } from '@angular/material/dialog';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';
import { InfoContainerComponent } from '@app/information/components/info-container/info-container';
import { Subscription } from 'rxjs';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { InfoContainerMobileComponent } from '@app/information/components/info-container-mobile/info-container-mobile';
import { AppComponent } from '../app/app';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Component({
  selector: 'cm-page',
  templateUrl: './page.html',
  styleUrls: ['./page.scss'],
  host: {'class': 'scroll-container'},
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
    isMobile = true;
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
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId,
        @Optional() @Inject(REQUEST) protected request: Request,
        private meta: Meta,
        public title: Title
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
        this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
            setTimeout(() => this.updateSiteMetaAndTitle());
        });
        this.dataSubscription = this.route.data.subscribe(data => {
            this.page = data.pages.find(p => p.titleEn === this.pageTitleEn);
            this.overviewPage = data.pages.find(p => p.titleEn === 'Overview');

            let fragment = this.route.snapshot.fragment;
            fragment = fragment ? fragment : 'top';
            
            // set lang in url if not set
            this.router.navigate(['.'], {
                relativeTo: this.route,
                queryParams: { 'lang': this.translate.currentLang },
                queryParamsHandling: 'merge',
                replaceUrl: true,
                fragment: fragment
            });

            this.updateSiteMetaAndTitle();
        });
    }

    private updateSiteMetaAndTitle() {
        let name;
        let keywords;
        let description;
        let canonicalUrl = "https://campusmedius.net";
        let alternateUrl;
        name = (this.translate.currentLang === 'de' ? this.page.titleDe : this.page.titleEn);
        keywords = (this.translate.currentLang === 'de' ? this.page.keywordsDe : this.page.keywordsEn);
        description = (this.translate.currentLang === 'de' ? this.page.abstractDe : this.page.abstractEn);

        if(this.page.titleEn === 'Overview') {
            canonicalUrl += '/overview';
        } else if(this.page.titleEn === 'Project Team') {
            canonicalUrl += '/team';
        } else if(this.page.titleEn === 'Book Edition') {
            canonicalUrl += '/book';
        }
        const screenshotUrl = this.translate.currentLang === 'de' ? "https://campusmedius.net/assets/screenshot_de.jpg" : "https://campusmedius.net/assets/screenshot_en.jpg"
        const copyrightNotice = this.translate.currentLang === 'de' ? "Wenn nicht anders angegeben, sind die Inhalte der Website unter Creative Commons CC BY 4.0 frei verfügbar. Diese Lizenz gestattet die uneingeschränkte Nutzung und Verbreitung des entsprechenden Materials unter der Bedingung, dass die UrheberInnen, bei denen alle Rechte verbleiben, und die Quelle eindeutig genannt werden. Die Referenz sollte in der Form erfolgen, wie sie in den Metadaten empfohlen wird, die über das Zitatsymbol neben dem Titel der jeweiligen Seite abgerufen werden können. Die offene Creative-Commons-Lizenz gilt allerdings nicht für die Werke (Texte, Bilder, Ton- und Filmaufnahmen), die in Campus Medius zitiert werden: Für deren Urheberrechte müssen in jedem Fall die angeführten Quellen konsultiert werden!" : "Unless stated otherwise, the website's content is available open access under Creative Commons CC BY 4.0. This license permits unrestricted use and distribution of the respective material, provided that the creator(s), who retain copyright, and the source are properly credited. The reference should be made in the form suggested in the metadata that can be accessed via the quote icon next to each page title. However, the open Creative Commons license does not apply to the works (texts, images, audio, video) cited in Campus Medius: for their copyright details, the sources given in the notes and captions must be consulted in each case!";
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

        alternateUrl = canonicalUrl + '?lang=' + (this.translate.currentLang === 'de' ? 'en' : 'de');
        canonicalUrl += '?lang=' + this.translate.currentLang;
        
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
        jsonLdScript.text = JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "ScholarlyArticle",
            "name":title,
            "headline":name,
            "abstract": description,
            "inLanguage": this.translate.currentLang,
            "image": screenshotUrl,
            "datePublished": this.page.created.toISOString(),
            "dateModified": this.page.updated.toISOString(),
            "keywords": keywords.join(','),
            "url": canonicalUrl,
            "author": {
                "@context": "https://schema.org/",
                "@type": "Person",
                "name": "Simon Ganahl"
            },
            "funder": funder,
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

    public showCite() {
        const dialogRef = this.dialog.open(CiteDialogComponent, {
            width: '800px',
            maxHeight: '90vh',
            data: {data: this.page, type: 'page', isMobile: this.isMobile},
            autoFocus: false
        });
    }

    public scrollUp() {
        this.router.navigate([], {
            queryParamsHandling: 'merge',
            fragment: 'top'
        });
    }

    public sectionChange(section: string) {
        if(section !== this.route.snapshot.fragment) {
            this.skipFragmentUpdate = true;
            this.router.navigate( [ ], { fragment: section, queryParams: { }, queryParamsHandling: 'merge', replaceUrl: true } );
        }
    }

    public mobileShowShort() {
        // this.app.removeHeader = false;
        // setTimeout(() => {
        //     this.showTitleHeaderMobile = false;
        //     this.app.showHeader = true;
        //     this.router.navigate( [ '/' ], { queryParamsHandling: 'merge' } );
        // });
    }

    @HostListener('scroll')
    private onMobileScroll() {
        if (this.galleryIsOpen) {
            return;
        }

        const scrollTop = this.elementRef.nativeElement.scrollTop;
        const clientHeight = this.elementRef.nativeElement.clientHeight;

        if (scrollTop < 270) {
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
        if (isPlatformBrowser(this.platformId)) {
            this.mediaSubscription.unsubscribe();
        }
    }
}
