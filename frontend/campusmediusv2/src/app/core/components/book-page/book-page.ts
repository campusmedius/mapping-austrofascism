import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Page } from '@app/information/models/page';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CiteDialogComponent } from '@app/information/components/cite-dialog/cite-dialog.component';

@Component({
  selector: 'cm-book-page',
  templateUrl: './book-page.html',
  styleUrls: ['./book-page.scss']
})
export class BookPageComponent implements OnInit {

  public page: Page;

  constructor(
      private translate: TranslateService,
      private route: ActivatedRoute,
      private dialog: MatDialog,
      private router: Router
  ) { }


  ngOnInit() {
      this.route.data.subscribe(data => {
          this.page = data.pages.find(p => p.titleEn === 'Book Edition');
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

}
