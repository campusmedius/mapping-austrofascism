import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SearchResult } from '@app/core/models/search';



@Component({
  selector: 'cm-search-result',
  templateUrl: './search-result.html',
  styleUrls: ['./search-result.scss']
})
export class SearchResultComponent implements OnInit {
  @Input() result: SearchResult;

  @Output() locationSelected = new EventEmitter<string>();

  constructor(
  ) { }

  ngOnInit() {

  }

  public openLocation(location: string) {
    this.locationSelected.emit(location);
  }

}
