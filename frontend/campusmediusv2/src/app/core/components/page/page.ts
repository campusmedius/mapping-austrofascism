import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '@app/information/models/page';
import { MatDialog } from '@angular/material';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { InfoContainerComponent } from '@app/information/components/info-container/info-container';

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

    @ViewChild(InfoContainerComponent, {static: false}) infoContainer: InfoContainerComponent;

    public page: Page;
    public showTitleHeader = false;
    private skipFragmentUpdate = false;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router,
        private scrollToService: ScrollToService,
    ) { }


    ngOnInit() {
        this.route.data.subscribe(data => {
            this.page = data.pages.find(p => p.titleEn === this.pageTitleEn);
        });
    }

    ngAfterViewInit() {
        this.route.fragment.subscribe(fragment => {
            console.log(this.skipFragmentUpdate);
            if (!this.skipFragmentUpdate) {
                setTimeout(() => {
                    fragment = fragment ? fragment : 'top';
                    this.infoContainer.scrollToReference(fragment);

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

}
