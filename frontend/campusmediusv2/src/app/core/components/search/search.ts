import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SearchResult, SearchDocument } from '@app/core/models/search';
import { HttpClient } from '@angular/common/http';


import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchService } from '@app/core/services/search';



@Component({
  selector: 'cm-search',
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('searchElement') searchElement: ElementRef;

  public searchResults: SearchResult[];


  searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private searchService: SearchService,
    private router: Router,
    public translate: TranslateService,
    private dialogRef: MatDialogRef<SearchComponent>,) {
      this.searchTermChanged.pipe(
        debounceTime(100), // wait 300ms after the last event before emitting last event
        distinctUntilChanged()) // only emit if value is different from previous value
        .subscribe(term => {
          this.searchResults = this.searchService.search(term, translate.currentLang);
        });
     }

  ngOnInit() {
    setTimeout(()=>{
      this.searchElement.nativeElement.focus();
    },0);  
  }

  searchByTerm(term: string) {
    this.searchTermChanged.next(term);
  }

  public openLocation(location: string) {
    this.close();
    this.router.navigateByUrl(location, /* Removed unsupported properties by Angular migration: queryParamsHandling. */ {});
  }

  close() {
    this.dialogRef.close();
  }

}
