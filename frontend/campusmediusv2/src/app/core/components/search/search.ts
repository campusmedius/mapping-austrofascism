import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material';
import { SearchResult, SearchDocument } from '@app/core/models/search';
import { HttpClient } from '@angular/common/http';

import { Builder, Index} from 'lunr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'cm-search',
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchElement', {static: false}) searchElement: ElementRef;

  public searchResults: SearchResult[];
  private searchDocumentsEn: SearchDocument[];
  private searchDocumentsDictEn: { [ref: string]: SearchDocument } = {};
  private searchDocumentsDe: SearchDocument[];
  private searchDocumentsDictDe: { [ref: string]: SearchDocument } = {};
  private searchIndexEn: Index;
  private searchIndexDe: Index;

  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<SearchComponent>,) {
      this.searchTermChanged.pipe(
        debounceTime(100), // wait 300ms after the last event before emitting last event
        distinctUntilChanged()) // only emit if value is different from previous value
        .subscribe(term => this.search(term));
     }

  ngOnInit() {
    (<any>window).ref = this.dialogRef;
    setTimeout(()=>{
      this.searchElement.nativeElement.focus();
    },0);  
    

        this.http.get("/assets/search/index_en.json").subscribe((data) => {
          this.searchIndexEn = Index.load(data)
        });
        this.http.get("/assets/search/index_de.json").subscribe((data) => {
          this.searchIndexDe = Index.load(data)
        });
        this.http.get("/assets/search/documents_en.json").subscribe((data: SearchDocument[]) => {
          this.searchDocumentsEn = data;
          this.searchDocumentsEn.forEach((d) => {
            this.searchDocumentsDictEn[d.location] = d;
          });
        });
        this.http.get("/assets/search/documents_de.json").subscribe((data: SearchDocument[]) => {
          this.searchDocumentsDe = data;
          this.searchDocumentsDe.forEach((d) => {
            this.searchDocumentsDictDe[d.location] = d;
          });
        });


        // this.http.get("http://localhost:8000/main/search-documents/en?format=json").subscribe((data: SearchDocument[]) => {
        //     const searchDocuments = data;

        //     searchDocuments.forEach((d) => {
        //       this.searchDocumentsDictEn[d.location] = d;
        //     });

        //     const builder = new Builder();

        //     builder.ref('location');
        //     builder.field('text');

        //     (<any>data).forEach((doc) => {
        //       let boost = 1;
        //       if(doc.type == 'event' || doc.type == 'mediator') {
        //         boost = 10;
        //       } else if(doc.type == 'page') {
        //         boost = 5;
        //       }
        //         builder.add(doc, { boost: boost });
        //     });

        //     this.searchIndexEn = builder.build();
        // });

        // this.http.get("http://localhost:8000/main/search-documents/de?format=json").subscribe((data: SearchDocument[]) => {
        //     const searchDocuments = data;

        //     searchDocuments.forEach((d) => {
        //       this.searchDocumentsDictDe[d.location] = d;
        //     });

        //     const builder = new Builder();

        //     builder.ref('location');
        //     builder.field('text');

        //     (<any>data).forEach((doc) => {
        //       let boost = 1;
        //       if(doc.type == 'event' || doc.type == 'mediator') {
        //         boost = 10;
        //       } else if(doc.type == 'page') {
        //         boost = 5;
        //       }
        //         builder.add(doc, { boost: boost });
        //     });

        //     this.searchIndexDe = builder.build();
        // });

  }

  searchByTerm(term: string) {
      this.searchTermChanged.next(term);
  }

  generateDisplayText(text: string, term: string) {

  }

  search(term: string) {
    term = term.trim();

    this.searchResults = [];

    if (!term || term === '') {
      return
    }

    const terms = term.split(' ');
    let enhancedTerm = '';
    terms.forEach((t) => {
      enhancedTerm += '*' + t + '* ';
    });

    let results;
    let searchDocumentsDict;
    if (this.translate.currentLang === 'de') {
      results = this.searchIndexDe.search(enhancedTerm);
      searchDocumentsDict = this.searchDocumentsDictDe;
    } else {
      results = this.searchIndexEn.search(enhancedTerm);
      searchDocumentsDict = this.searchDocumentsDictEn;
    }

    const searchResultsPerTitle = {};
    for (let index = 0; index < results.length; index++) {
      const r = results[index];
      const doc = searchDocumentsDict[r.ref];
      if (!searchResultsPerTitle[doc.title]) {
        searchResultsPerTitle[doc.title] = {
          term: term,
          title: doc.title,
          location: doc.location.split('#')[0],
          textDocuments: [],
          mediaDocuments: []
        }
        this.searchResults.push(searchResultsPerTitle[doc.title]);
      }
      if (doc.type === 'page' || doc.type == 'mediator', doc.type == 'event') {
        searchResultsPerTitle[doc.title].textDocuments.push(doc);
      } else {
        searchResultsPerTitle[doc.title].mediaDocuments.push(doc);
      }

      if (r.score < 1) {
        break;
      }
    };
  }

  public openLocation(location: string) {
    this.close();
    this.router.navigateByUrl(location, {
      queryParamsHandling: 'merge'
  });
  }

  close() {
    this.dialogRef.close();
  }

}
